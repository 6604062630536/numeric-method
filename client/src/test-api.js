// test-api.js - ใช้สำหรับทดสอบ API connection
// วิธีใช้: node test-api.js

const axios = require("axios");

const API_URL = "http://localhost:10000/api";

async function testAPI() {
  console.log("🧪 Testing API Connection...\n");

  // Test 1: Check server is running
  console.log("1️⃣ Testing server connection...");
  try {
    const response = await axios.get(`${API_URL}/test`);
    console.log("✅ Server is running");
    console.log("   Response:", response.data);
  } catch (error) {
    console.log("❌ Server is not running or unreachable");
    console.log("   Error:", error.message);
    return;
  }

  // Test 2: Save equation
  console.log("\n2️⃣ Testing save equation...");
  try {
    const response = await axios.post(
      `${API_URL}/save/rootequation/all`,
      { equation: "x^2-4" },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("✅ Equation saved successfully");
    console.log("   Response:", response.data);
  } catch (error) {
    console.log("❌ Failed to save equation");
    console.log("   Error:", error.response?.data || error.message);
  }

  // Test 3: Load equation
  console.log("\n3️⃣ Testing load equation...");
  try {
    const response = await axios.get(`${API_URL}/load/rootequation/all`, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("✅ Equation loaded successfully");
    console.log("   Response:", response.data);
    console.log("   Equation:", response.data.equations[0]?.equation);
  } catch (error) {
    console.log("❌ Failed to load equation");
    console.log("   Error:", error.response?.data || error.message);
  }

  console.log("\n✨ API Test Complete!\n");
}

testAPI();
