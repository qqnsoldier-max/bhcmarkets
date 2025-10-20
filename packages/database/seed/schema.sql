-- schema.sql
-- PostgreSQL DDL for auth + trading platform core
-- Assumes PostgreSQL >= 12

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- index support if needed

/* === ENUMS === */
CREATE TYPE user_status AS ENUM ('active','pending','suspended','deleted');
CREATE TYPE user_role AS ENUM ('user','admin','support');
CREATE TYPE account_type AS ENUM ('spot','margin','futures','demo');
CREATE TYPE account_status AS ENUM ('active','locked','closed');
CREATE TYPE ref_type AS ENUM ('order','trade','deposit','withdrawal','fee','adjustment');
CREATE TYPE order_side AS ENUM ('buy','sell');
CREATE TYPE order_type AS ENUM ('market','limit','stop','take_profit');
CREATE TYPE order_status AS ENUM ('new','partially_filled','filled','cancelled','rejected');
CREATE TYPE kyc_status AS ENUM ('not_submitted','pending','verified','rejected');
CREATE TYPE deposit_status AS ENUM ('pending','completed','failed','cancelled');
CREATE TYPE notification_type AS ENUM ('system','trade','security','pnl');

/* === USERS & AUTH === */
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  status user_status NOT NULL DEFAULT 'pending',
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token TEXT NOT NULL,
  user_agent TEXT,
  ip_address INET,
  device_fingerprint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT auth_sessions_user_refresh UNIQUE (user_id, refresh_token)
);

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  country VARCHAR(100),
  phone_number VARCHAR(30),
  date_of_birth DATE,
  kyc_status kyc_status NOT NULL DEFAULT 'not_submitted',
  kyc_metadata JSONB, -- store KYC provider response or document references
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

/* === ACCOUNTS / WALLETS === */
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  currency VARCHAR(10) NOT NULL, -- ISO code: USD, EUR, BTC
  balance NUMERIC(30, 10) NOT NULL DEFAULT 0, -- current available balance
  locked NUMERIC(30, 10) NOT NULL DEFAULT 0, -- funds locked for open orders / margin
  account_type account_type NOT NULL DEFAULT 'spot',
  status account_status NOT NULL DEFAULT 'active',
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT positive_balance CHECK (balance >= 0),
  CONSTRAINT positive_locked CHECK (locked >= 0)
);

CREATE INDEX idx_accounts_user ON accounts(user_id);
CREATE INDEX idx_accounts_currency ON accounts(currency);

/* === LEDGER (immutable double-entry) ===
   Approach: ledger_entries represent a posting to a single account.
   For each logical financial event, create two ledger_entries (debit + credit)
   with the same reference_id + reference_type to correlate them.
*/
CREATE TABLE ledger_entries (
  id BIGSERIAL PRIMARY KEY,
  entry_uuid UUID DEFAULT gen_random_uuid() NOT NULL,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  reference_id UUID, -- e.g. order id or trade id
  reference_type ref_type,
  amount NUMERIC(30, 10) NOT NULL, -- positive = credit (increase), negative = debit (decrease)
  balance_after NUMERIC(30, 10) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  description TEXT,
  metadata JSONB
);

CREATE INDEX idx_ledger_account ON ledger_entries(account_id);
CREATE INDEX idx_ledger_reference ON ledger_entries(reference_id);

/* === ORDERS & TRADES === */
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  symbol VARCHAR(64) NOT NULL, -- e.g. BTC/USD
  side order_side NOT NULL,
  type order_type NOT NULL,
  price NUMERIC(30, 10), -- nullable for market orders
  quantity NUMERIC(30, 10) NOT NULL,
  filled_quantity NUMERIC(30, 10) NOT NULL DEFAULT 0,
  status order_status NOT NULL DEFAULT 'new',
  time_in_force VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_account ON orders(account_id);
CREATE INDEX idx_orders_symbol ON orders(symbol);
CREATE INDEX idx_orders_status ON orders(status);

/* trades are executions of matched orders */
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  counterparty_order_id UUID,
  maker_account_id UUID,
  taker_account_id UUID,
  price NUMERIC(30, 10) NOT NULL,
  quantity NUMERIC(30, 10) NOT NULL,
  fee NUMERIC(30, 10) NOT NULL DEFAULT 0,
  fee_currency VARCHAR(10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB
);

CREATE INDEX idx_trades_order ON trades(order_id);
CREATE INDEX idx_trades_time ON trades(created_at);

/* === POSITIONS === */
CREATE TABLE positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  symbol VARCHAR(64) NOT NULL,
  side VARCHAR(10) NOT NULL, -- 'long' or 'short'
  quantity NUMERIC(30, 10) NOT NULL DEFAULT 0,
  entry_price NUMERIC(30, 10),
  unrealized_pnl NUMERIC(30, 10) DEFAULT 0,
  realized_pnl NUMERIC(30, 10) DEFAULT 0,
  liquidation_price NUMERIC(30, 10),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB
);

CREATE UNIQUE INDEX uq_positions_account_symbol ON positions(account_id, symbol);

/* === DEPOSITS & WITHDRAWALS === */
CREATE TABLE deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  amount NUMERIC(30, 10) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  status deposit_status NOT NULL DEFAULT 'pending',
  tx_hash TEXT, -- for onchain deposits
  external_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  amount NUMERIC(30, 10) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  destination JSONB, -- payout details
  status deposit_status NOT NULL DEFAULT 'pending',
  tx_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

/* === PNL SNAPSHOTS === */
CREATE TABLE pnl_snapshots (
  id BIGSERIAL PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  realized_pnl NUMERIC(30, 10) DEFAULT 0,
  unrealized_pnl NUMERIC(30, 10) DEFAULT 0,
  balance NUMERIC(30, 10) DEFAULT 0,
  net_worth NUMERIC(30, 10) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (account_id, snapshot_date)
);

/* === AUDIT & NOTIFICATIONS === */
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL DEFAULT 'system',
  title TEXT,
  body TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helpful triggers: update updated_at on row changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Attach to tables that have updated_at
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_deposits_updated_at BEFORE UPDATE ON deposits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_withdrawals_updated_at BEFORE UPDATE ON withdrawals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

/* === Notes ===
 - Ledger: application must create paired ledger_entries for each transfer (credit + debit).
 - Use SERIALIZABLE or REPEATABLE READ transactions for critical operations where needed.
 - Consider materialized views or read replicas for heavy reporting queries.
*/
