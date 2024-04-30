export function healthAPI(app: any) {
  app.get("/", async (req: any, res: any, next: any) => {
    try {
      res.status(200).json({ message: "Server running" });
    } catch (err: any) {
      res.status(400).json({ message: err.response.data });
    }
  });
}
