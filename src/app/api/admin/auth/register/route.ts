export async function POST(req: Request) {
  return Response.json(
    { error: "Admin registration is disabled. Use the Kelola Guru page." },
    { status: 405 }
  );
}
