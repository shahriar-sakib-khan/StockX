import { Router } from "express";

const router = Router()

router.get("/", async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now())
  })
  res.json({ msg: "user logged out" });
});

export default router;
