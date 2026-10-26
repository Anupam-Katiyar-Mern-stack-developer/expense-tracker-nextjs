import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query("select current_database() as database");

    return Response.json({
      success: true,
      message: "DATABASE connected successfull !",
      database: result.rows[0].database,
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    return Response.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 },
    );
  }
}
