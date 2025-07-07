import { Router } from "express";

const router = Router()

router.get("/", async (req, res) => {
  console.log("tried to logout");
  res.json({ logout: "logout" });
});

export default router;
