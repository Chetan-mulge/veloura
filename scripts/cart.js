const options = {
  // existing fields...
  description: "Purchase Description",
  method: {
    upi: true,
    card: true,
    netbanking: true,
    wallet: true
  },

  prefill: {
    name: name,
    email: "test@veloura.com",
    contact: phone
  },
  // other existing fields...
}