-- Create users table with NOT NULL constraints
CREATE TABLE israel_duff.users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    address TEXT,
    phone_number VARCHAR(20)
);

-- Create hobbies table with foreign key and composite primary key
CREATE TABLE israel_duff.hobbies (
    user_id INTEGER NOT NULL REFERENCES israel_duff.users(id) ON DELETE CASCADE,
    hobbies VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, hobbies)
);