// src/utils/tryCatch.ts
// NEW: helper เล็กๆ สำหรับหุ้ม async/await

export async function tryCatch<T>(p: Promise<T>): Promise<[T | null, any]> {
  try {
    const data = await p;
    return [data, null];
  } catch (e) {
    return [null, e];
  }
}
