import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertFamilySchema, insertMemberSchema, insertChoreSchema, insertRewardSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, familyCode, avatar, isParent } = req.body;

      if (!name || !familyCode || !avatar) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      let family = await storage.getFamilyByCode(familyCode);
      
      if (!family) {
        const familyData = insertFamilySchema.parse({
          code: familyCode,
          name: familyCode.replace(/boss$/i, ''),
        });
        family = await storage.createFamily(familyData);
      }

      const memberData = insertMemberSchema.parse({
        familyId: family.id,
        name,
        avatar,
        isParent: isParent || false,
      });

      const member = await storage.createMember(memberData);

      res.json({ success: true, member, family });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Signup failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { name, familyCode } = req.body;

      if (!name || !familyCode) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const family = await storage.getFamilyByCode(familyCode);
      if (!family) {
        return res.status(404).json({ error: "Family not found" });
      }

      const members = await storage.getMembersByFamily(family.id);
      const member = members.find(m => m.name === name);

      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }

      res.json({ success: true, member, family });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/families/:familyId/members", async (req, res) => {
    try {
      const members = await storage.getMembersByFamily(req.params.familyId);
      res.json(members);
    } catch (error) {
      console.error("Get members error:", error);
      res.status(500).json({ error: "Failed to fetch members" });
    }
  });

  app.post("/api/chores", async (req, res) => {
    try {
      const choreData = insertChoreSchema.parse(req.body);
      const chore = await storage.createChore(choreData);
      res.json(chore);
    } catch (error) {
      console.error("Create chore error:", error);
      res.status(500).json({ error: "Failed to create chore" });
    }
  });

  app.get("/api/families/:familyId/chores", async (req, res) => {
    try {
      const chores = await storage.getChoresByFamily(req.params.familyId);
      res.json(chores);
    } catch (error) {
      console.error("Get chores error:", error);
      res.status(500).json({ error: "Failed to fetch chores" });
    }
  });

  app.patch("/api/chores/:id/claim", async (req, res) => {
    try {
      const { memberId } = req.body;
      const chore = await storage.getChore(req.params.id);
      
      if (!chore) {
        return res.status(404).json({ error: "Chore not found" });
      }

      const updated = await storage.updateChoreStatus(req.params.id, "claimed", memberId);
      res.json(updated);
    } catch (error) {
      console.error("Claim chore error:", error);
      res.status(500).json({ error: "Failed to claim chore" });
    }
  });

  app.patch("/api/chores/:id/complete", async (req, res) => {
    try {
      const { memberId } = req.body;
      const chore = await storage.getChore(req.params.id);
      
      if (!chore) {
        return res.status(404).json({ error: "Chore not found" });
      }

      const updated = await storage.updateChoreStatus(req.params.id, "pending", memberId);
      res.json(updated);
    } catch (error) {
      console.error("Complete chore error:", error);
      res.status(500).json({ error: "Failed to complete chore" });
    }
  });

  app.patch("/api/chores/:id/approve", async (req, res) => {
    try {
      const chore = await storage.getChore(req.params.id);
      
      if (!chore || !chore.completedById) {
        return res.status(404).json({ error: "Chore not found or not completed" });
      }

      const member = await storage.getMember(chore.completedById);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }

      await storage.updateMemberPoints(
        member.id,
        member.weeklyPoints + chore.points,
        member.totalPoints + chore.points
      );

      const updated = await storage.updateChoreStatus(req.params.id, "completed");
      res.json(updated);
    } catch (error) {
      console.error("Approve chore error:", error);
      res.status(500).json({ error: "Failed to approve chore" });
    }
  });

  app.patch("/api/chores/:id/assign", async (req, res) => {
    try {
      const { assignedToId, assignedById } = req.body;
      const updated = await storage.assignChore(req.params.id, assignedToId, assignedById);
      res.json(updated);
    } catch (error) {
      console.error("Assign chore error:", error);
      res.status(500).json({ error: "Failed to assign chore" });
    }
  });

  app.delete("/api/chores/:id", async (req, res) => {
    try {
      const success = await storage.deleteChore(req.params.id);
      res.json({ success });
    } catch (error) {
      console.error("Delete chore error:", error);
      res.status(500).json({ error: "Failed to delete chore" });
    }
  });

  app.post("/api/rewards", async (req, res) => {
    try {
      const rewardData = insertRewardSchema.parse(req.body);
      const reward = await storage.createReward(rewardData);
      res.json(reward);
    } catch (error) {
      console.error("Create reward error:", error);
      res.status(500).json({ error: "Failed to create reward" });
    }
  });

  app.get("/api/families/:familyId/rewards", async (req, res) => {
    try {
      const rewards = await storage.getRewardsByFamily(req.params.familyId);
      res.json(rewards);
    } catch (error) {
      console.error("Get rewards error:", error);
      res.status(500).json({ error: "Failed to fetch rewards" });
    }
  });

  app.patch("/api/rewards/:id", async (req, res) => {
    try {
      const { emoji, title, pointCost } = req.body;
      const updated = await storage.updateReward(req.params.id, { emoji, title, pointCost });
      res.json(updated);
    } catch (error) {
      console.error("Update reward error:", error);
      res.status(500).json({ error: "Failed to update reward" });
    }
  });

  app.delete("/api/rewards/:id", async (req, res) => {
    try {
      const success = await storage.deleteReward(req.params.id);
      res.json({ success });
    } catch (error) {
      console.error("Delete reward error:", error);
      res.status(500).json({ error: "Failed to delete reward" });
    }
  });

  app.post("/api/rewards/:id/redeem", async (req, res) => {
    try {
      const { memberId } = req.body;
      const reward = await storage.getReward(req.params.id);
      
      if (!reward) {
        return res.status(404).json({ error: "Reward not found" });
      }

      const member = await storage.getMember(memberId);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }

      if (member.totalPoints < reward.pointCost) {
        return res.status(400).json({ error: "Insufficient points" });
      }

      await storage.updateMemberPoints(
        member.id,
        member.weeklyPoints,
        member.totalPoints - reward.pointCost
      );

      const redemption = await storage.createRewardRedemption({
        rewardId: reward.id,
        memberId: member.id,
        pointsSpent: reward.pointCost,
      });

      res.json({ success: true, redemption });
    } catch (error) {
      console.error("Redeem reward error:", error);
      res.status(500).json({ error: "Failed to redeem reward" });
    }
  });

  app.patch("/api/members/:id/points", async (req, res) => {
    try {
      const { points } = req.body;
      const member = await storage.getMember(req.params.id);
      
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }

      const updated = await storage.updateMemberPoints(
        member.id,
        member.weeklyPoints + points,
        member.totalPoints + points
      );

      res.json(updated);
    } catch (error) {
      console.error("Update points error:", error);
      res.status(500).json({ error: "Failed to update points" });
    }
  });

  app.post("/api/families/:familyId/reset-weekly", async (req, res) => {
    try {
      await storage.resetWeeklyPoints(req.params.familyId);
      res.json({ success: true });
    } catch (error) {
      console.error("Reset weekly points error:", error);
      res.status(500).json({ error: "Failed to reset weekly points" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
