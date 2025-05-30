const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database setup
const dbPath = path.join(__dirname, 'cs179g.db');
const db = new sqlite3.Database(dbPath);

console.log('Setting up CS179G database with real data from data_base_file.json...');

// Load real data from JSON file
const dataFilePath = path.join(__dirname, '../../data_base_file.json');
let realData = [];

try {
  if (fs.existsSync(dataFilePath)) {
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    realData = JSON.parse(jsonData);
    console.log(`📁 Loaded ${realData.length} records from data_base_file.json`);
  } else {
    console.log('⚠️  data_base_file.json not found, using sample data');
  }
} catch (error) {
  console.error('❌ Error reading data_base_file.json:', error.message);
  console.log('Using sample data instead');
}

// Create table
db.serialize(() => {
  // Drop table if exists
  db.run("DROP TABLE IF EXISTS facial_data");

  // Create facial_data table with updated structure
  db.run(`CREATE TABLE facial_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_path TEXT,
    label TEXT,
    prediction TEXT,
    confidence_score REAL,
    encoding_type TEXT,
    model_type TEXT,
    region_importance TEXT,
    features TEXT,
    confidence_based_accuracy TEXT,
    image_accuracy_original REAL,
    image_accuracy_lower_quality REAL,
    performance_score REAL,
    created_at TEXT
  )`);

  // Insert real data or fallback to sample data
  let dataToInsert = [];

  if (realData.length > 0) {
    // Use real data from JSON file
    dataToInsert = realData.map((record, index) => [
      record.path,
      record.label,
      record.prediction,
      record.confidence_score,
      record.encoding_type,
      record.model_type,
      record.region_importance,
      record.features,
      record.confidence_based_accuracy,
      record.image_accuracy_original,
      record.image_accuracy_lower_quality,
      record.performance_score,
      new Date().toISOString()
    ]);
  } else {
    // Fallback sample data with new structure
    dataToInsert = [
      ['subject_001_frame_045.jpg', 'truth', 'truth', 0.92, 'low_level', 'Random Forest', 'cheeks, jaw', null, 'High Confidence Correct', 0.91, 0.89, 0.90, '2024-01-15 14:30:22'],
      ['subject_002_frame_123.jpg', 'lie', 'lie', 0.85, 'high_level', 'Decision Tree', 'eyes, mouth', null, 'Medium Confidence Correct', 0.84, 0.82, 0.83, '2024-01-15 14:31:45'],
      ['subject_003_frame_067.jpg', 'truth', 'truth', 0.78, 'low_level', 'Random Forest', 'forehead, nose', null, 'Low Confidence Correct', 0.79, 0.77, 0.78, '2024-01-15 14:32:10']
    ];
  }

  const stmt = db.prepare(`INSERT INTO facial_data
    (image_path, label, prediction, confidence_score, encoding_type, model_type, region_importance, features, confidence_based_accuracy, image_accuracy_original, image_accuracy_lower_quality, performance_score, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  dataToInsert.forEach(row => {
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
    COUNT(CASE WHEN prediction = 'truth' THEN 1 END) as truth_count,
    COUNT(CASE WHEN prediction = 'lie' THEN 1 END) as lie_count,
    AVG(confidence_score) as avg_confidence,
    encoding_type,
    COUNT(*) as method_count
  FROM facial_data
  GROUP BY encoding_type`, (err, rows) => {
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
