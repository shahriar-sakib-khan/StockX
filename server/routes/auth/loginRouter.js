import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => {
  console.log("tried to login");
  res.json({ login: "login" });
});

export default router;
