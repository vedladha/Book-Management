const User = require("../models/models.js");
const Dashboard = require("../models/dashboard.js");
class dashController {
  
  async getDashboardPage(req, res) {
    try {
      const { userId } = req;

      const user = await User.findOne({ _id: userId });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.render("dashboard", { email: user.email });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }

  async getProduct(req, res) {
    try {
      let item_data = {};
      if (req.body.title) item_data = { title: req.body.title };
      const item = await Dashboard.find(item_data);

      if (!item) {
        return res.status(404).send({ error: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async createProduct(req, res) {
    const { title, description, quantity, price } = req.body;
    try {
      const newItem = new Dashboard({ title, description, price, quantity });
      const item = await newItem.save();
      res.json(item);
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  }

  async updateProduct(req, res) {
    const { id } = req.params;
    const { title, description, quantity, price } = req.body;
    try {
      const item = await Dashboard.findByIdAndUpdate(
        id,
        {
          title,
          description,
          quantity,
          price,
        },
        { new: true }
      ).lean();
      if (!item) {
        console.log(item);
        return res.status(404).send({ error: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async deleteProduct(req, res) {
    const { id } = req.params;
    try {
      const item = await Dashboard.findById(id);

      if (!item) {
        return res.status(404).send({ error: "Item not found" });
      }
      await Dashboard.deleteOne({ _id: id });
      res.json({ message: "Item deleted" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}

module.exports = new dashController();
