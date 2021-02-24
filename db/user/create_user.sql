INSERT INTO users (username, password, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5)
returning *;