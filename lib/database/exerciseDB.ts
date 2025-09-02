import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

export interface ExerciseRecord {
  id: string;
  date: string; // YYYY-MM-DD format
  exerciseName: string;
  sets: number;
  reps: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 데이터베이스 초기화 (한 번만 실행)
export const initExerciseDatabase = async (): Promise<void> => {
  // 이미 초기화 중이면 기존 Promise 반환
  if (initializationPromise) {
    return initializationPromise;
  }

  // 이미 초기화 완료되었으면 즉시 반환
  if (isInitialized && db) {
    return Promise.resolve();
  }

  // 초기화 시작
  initializationPromise = (async () => {
    try {
      if (!db) {
        db = await SQLite.openDatabaseAsync("burnfit.db");
      }

      if (!isInitialized) {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS exercise_records (
            id TEXT PRIMARY KEY,
            date TEXT NOT NULL,
            exerciseName TEXT NOT NULL,
            sets INTEGER NOT NULL,
            reps INTEGER NOT NULL,
            notes TEXT,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL
          );
        `);

        isInitialized = true;
        console.log("Exercise database initialized successfully");
      }
    } catch (error) {
      console.error("Database initialization error:", error);
      // 초기화 실패 시 Promise 초기화
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
};

// 데이터베이스가 초기화되지 않은 경우 자동 초기화
const ensureInitialized = async () => {
  if (!isInitialized) {
    await initExerciseDatabase();
  }
};

// 운동 기록 추가
export const addExerciseRecord = async (
  date: string,
  exerciseName: string,
  sets: number,
  reps: number,
  notes?: string
): Promise<string> => {
  await ensureInitialized();

  if (!db) {
    throw new Error("Database not initialized");
  }

  try {
    const recordId =
      Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();

    await db.execAsync(
      `INSERT INTO exercise_records (id, date, exerciseName, sets, reps, notes, createdAt, updatedAt) 
       VALUES ('${recordId}', '${date}', '${exerciseName}', ${sets}, ${reps}, '${
        notes || ""
      }', '${now}', '${now}')`
    );

    return recordId;
  } catch (error) {
    console.error("Add exercise record error:", error);
    throw error;
  }
};

// 특정 날짜의 운동 기록 가져오기
export const getExerciseRecordsByDate = async (
  date: string
): Promise<ExerciseRecord[]> => {
  await ensureInitialized();

  if (!db) {
    throw new Error("Database not initialized");
  }

  try {
    const result = await db.getAllAsync(`
      SELECT * FROM exercise_records 
      WHERE date = '${date}'
      ORDER BY createdAt ASC
    `);

    return result as ExerciseRecord[];
  } catch (error) {
    console.error("Get exercise records error:", error);
    throw error;
  }
};

// 운동 기록 수정
export const updateExerciseRecord = async (
  id: string,
  exerciseName: string,
  sets: number,
  reps: number,
  notes?: string
): Promise<void> => {
  await ensureInitialized();

  if (!db) {
    throw new Error("Database not initialized");
  }

  try {
    const now = new Date().toISOString();

    await db.execAsync(
      `UPDATE exercise_records 
       SET exerciseName = '${exerciseName}', sets = ${sets}, reps = ${reps}, notes = '${
        notes || ""
      }', updatedAt = '${now}'
       WHERE id = '${id}'`
    );
  } catch (error) {
    console.error("Update exercise record error:", error);
    throw error;
  }
};

// 운동 기록 삭제
export const deleteExerciseRecord = async (id: string): Promise<void> => {
  await ensureInitialized();

  if (!db) {
    throw new Error("Database not initialized");
  }

  try {
    await db.execAsync(`DELETE FROM exercise_records WHERE id = '${id}'`);
  } catch (error) {
    console.error("Delete exercise record error:", error);
    throw error;
  }
};

export default db;
