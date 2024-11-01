const { Router } = require("express");
const { addDataToDatabase, loadDataFromDatabase } = require("../../mongo");
const router = Router();

router.post("/save/rootequation/all", (req, res) => {
  const { equation, XL, XR } = req.body;
  console.log(req.body);

  if (!equation) {
    return res.status(400).json({ status: "error", error: "Bad Request" });
  }

  if (/['"{}[]=&%#@!]/.test(equation)) {
    return res.status(400).json({ status: "Error wrong equation!" });
  }
  const data = {
    equation: equation,
  };
  if (XR && XL) {
    data["XR"] = XR;
    data["XL"] = XL;
  }

  console.log(data);
  addDataToDatabase("RootEquation", "All", data);
  return res.status(200).json({ status: "pass" });
});

router.get("/load/rootequation/all/:limit?", async (req, res) => {
  const limit = parseInt(req.params.limit || 1);
  const equations = await loadDataFromDatabase("RootEquation", "All", limit);
  const newEquations = equations.map((val) => ({
    equation: val.equation,
    XL: val.XL,
    XR: val.XR,
  }));

  console.log(newEquations);
  return res.status(200).json({
    status: "pass",
    equations: newEquations,
  });
});

module.exports = router;
