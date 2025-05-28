const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database setup
const dbPath = path.join(__dirname, 'cs179g.db');
const db = new sqlite3.Database(dbPath);

console.log('Setting up CS179G database with sample data...');

// Create table
db.serialize(() => {
  // Drop table if exists
  db.run("DROP TABLE IF EXISTS facial_data");

  // Create facial_data table
  db.run(`CREATE TABLE facial_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER,
    image_path TEXT,
    label TEXT,
    model_confidence REAL,
    accuracy REAL,
    encoding_method TEXT,
    processing_time REAL,
    created_at TEXT
  )`);

  // Insert sample data
  const sampleData = [
    [1, 'subject_001_frame_045.jpg', 'truth', 0.92, 0.91, 'HOG', 1.8, '2024-01-15 14:30:22'],
    [2, 'subject_002_frame_123.jpg', 'lie', 0.85, 0.87, 'dlib', 2.1, '2024-01-15 14:31:45'],
    [3, 'subject_003_frame_067.jpg', 'truth', 0.78, 0.82, 'ResNet18', 3.2, '2024-01-15 14:32:10'],
    [4, 'subject_004_frame_089.jpg', 'lie', 0.91, 0.89, 'HOG', 1.5, '2024-01-15 14:33:15'],
    [5, 'subject_005_frame_156.jpg', 'truth', 0.87, 0.85, 'dlib', 2.3, '2024-01-15 14:34:20'],
    [6, 'subject_006_frame_234.jpg', 'lie', 0.79, 0.81, 'ResNet18', 3.1, '2024-01-15 14:35:25'],
    [7, 'subject_007_frame_078.jpg', 'truth', 0.94, 0.93, 'HOG', 1.7, '2024-01-15 14:36:30'],
    [8, 'subject_008_frame_145.jpg', 'lie', 0.88, 0.86, 'dlib', 2.0, '2024-01-15 14:37:35'],
    [9, 'subject_009_frame_189.jpg', 'truth', 0.83, 0.84, 'ResNet18', 2.9, '2024-01-15 14:38:40'],
    [10, 'subject_010_frame_267.jpg', 'lie', 0.90, 0.88, 'HOG', 1.6, '2024-01-15 14:39:45'],
    [11, 'subject_011_frame_098.jpg', 'truth', 0.86, 0.87, 'dlib', 2.2, '2024-01-15 14:40:50'],
    [12, 'subject_012_frame_176.jpg', 'lie', 0.82, 0.83, 'ResNet18', 3.0, '2024-01-15 14:41:55'],
    [13, 'subject_013_frame_054.jpg', 'truth', 0.95, 0.94, 'HOG', 1.4, '2024-01-15 14:43:00'],
    [14, 'subject_014_frame_132.jpg', 'lie', 0.89, 0.90, 'dlib', 2.4, '2024-01-15 14:44:05'],
    [15, 'subject_015_frame_210.jpg', 'truth', 0.81, 0.80, 'ResNet18', 3.3, '2024-01-15 14:45:10'],
    [16, 'subject_016_frame_087.jpg', 'lie', 0.93, 0.92, 'HOG', 1.9, '2024-01-15 14:46:15'],
    [17, 'subject_017_frame_165.jpg', 'truth', 0.84, 0.85, 'dlib', 2.1, '2024-01-15 14:47:20'],
    [18, 'subject_018_frame_243.jpg', 'lie', 0.87, 0.86, 'ResNet18', 2.8, '2024-01-15 14:48:25'],
    [19, 'subject_019_frame_076.jpg', 'truth', 0.92, 0.91, 'HOG', 1.8, '2024-01-15 14:49:30'],
    [20, 'subject_020_frame_154.jpg', 'lie', 0.85, 0.87, 'dlib', 2.3, '2024-01-15 14:50:35'],
    [21, 'subject_021_frame_198.jpg', 'truth', 0.88, 0.89, 'ResNet18', 3.1, '2024-01-15 14:51:40'],
    [22, 'subject_022_frame_065.jpg', 'lie', 0.91, 0.90, 'HOG', 1.7, '2024-01-15 14:52:45'],
    [23, 'subject_023_frame_143.jpg', 'truth', 0.86, 0.85, 'dlib', 2.0, '2024-01-15 14:53:50'],
    [24, 'subject_024_frame_221.jpg', 'lie', 0.83, 0.84, 'ResNet18', 2.9, '2024-01-15 14:54:55'],
    [25, 'subject_025_frame_099.jpg', 'truth', 0.94, 0.93, 'HOG', 1.5, '2024-01-15 14:56:00']
  ];

  const stmt = db.prepare(`INSERT INTO facial_data 
    (subject_id, image_path, label, model_confidence, accuracy, encoding_method, processing_time, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

  sampleData.forEach(row => {
    stmt.run(row);
  });

  stmt.finalize();

  // Verify data was inserted
  db.get("SELECT COUNT(*) as count FROM facial_data", (err, row) => {
    if (err) {
      console.error('Error counting records:', err);
    } else {
      console.log(`✅ Successfully inserted ${row.count} records into facial_data table`);
    }
  });

  // Show sample of data
  db.all("SELECT * FROM facial_data LIMIT 5", (err, rows) => {
    if (err) {
      console.error('Error fetching sample data:', err);
    } else {
      console.log('\n📊 Sample data:');
      console.table(rows);
    }
  });

  // Show statistics
  db.all(`SELECT 
    COUNT(*) as total_records,
    COUNT(CASE WHEN label = 'truth' THEN 1 END) as truth_count,
    COUNT(CASE WHEN label = 'lie' THEN 1 END) as lie_count,
    AVG(model_confidence) as avg_confidence,
    encoding_method,
    COUNT(*) as method_count
  FROM facial_data 
  GROUP BY encoding_method`, (err, rows) => {
    if (err) {
      console.error('Error fetching stats:', err);
    } else {
      console.log('\n📈 Statistics by encoding method:');
      console.table(rows);
    }

    // Close database
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('\n✅ Database setup complete!');
        console.log('🚀 You can now start the server with: node server.js');
      }
    });
  });
});
