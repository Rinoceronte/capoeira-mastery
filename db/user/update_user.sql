UPDATE users SET first_name = $2, last_name = $3, password = $4, profile_pic = $5 WHERE id = $1
returning *;