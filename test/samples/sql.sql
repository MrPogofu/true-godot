-- Leaderboard queries
CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name VARCHAR(64) NOT NULL,
    score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO scores (player_name, score) VALUES ('Godette', 9001), ('Bob', 42);

SELECT s.player_name, MAX(s.score) AS best, COUNT(*) AS games
FROM scores AS s
LEFT JOIN players p ON p.name = s.player_name
WHERE s.score > 100 AND p.banned IS NULL
GROUP BY s.player_name
HAVING COUNT(*) >= 3
ORDER BY best DESC
LIMIT 10;

UPDATE scores SET score = score + 1 WHERE id = 7;
DELETE FROM scores WHERE created_at < '2024-01-01';
