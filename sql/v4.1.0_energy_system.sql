-- profiles tablosuna enerji sistemi için gerekli sütunların eklenmesi
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS energy INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS last_energy_refill TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Enerjinin 5'ten fazla olmamasını garanti altına alan bir kısıtlama (isteğe bağlı ama güvenli)
ALTER TABLE profiles 
ADD CONSTRAINT energy_max_limit CHECK (energy <= 5);
