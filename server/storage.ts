import {
  type Family,
  type InsertFamily,
  type Member,
  type InsertMember,
  type Chore,
  type InsertChore,
  type Reward,
  type InsertReward,
  type RewardRedemption,
  type InsertRewardRedemption,
} from "../shared/schema.js";
import { randomUUID } from "crypto";

export interface IStorage {
  createFamily(family: InsertFamily): Promise<Family>;
  getFamilyByCode(code: string): Promise<Family | undefined>;
  getFamily(id: string): Promise<Family | undefined>;

  createMember(member: InsertMember): Promise<Member>;
  getMember(id: string): Promise<Member | undefined>;
  getMembersByFamily(familyId: string): Promise<Member[]>;
  updateMemberPoints(id: string, weeklyPoints: number, totalPoints: number): Promise<Member | undefined>;
  updateMemberStreak(id: string, streak: number): Promise<Member | undefined>;
  resetWeeklyPoints(familyId: string): Promise<void>;

  createChore(chore: InsertChore): Promise<Chore>;
  getChore(id: string): Promise<Chore | undefined>;
  getChoresByFamily(familyId: string): Promise<Chore[]>;
  updateChoreStatus(id: string, status: string, completedById?: string): Promise<Chore | undefined>;
  assignChore(id: string, assignedToId: string, assignedById: string): Promise<Chore | undefined>;
  deleteChore(id: string): Promise<boolean>;

  createReward(reward: InsertReward): Promise<Reward>;
  getReward(id: string): Promise<Reward | undefined>;
  getRewardsByFamily(familyId: string): Promise<Reward[]>;
  updateReward(id: string, updates: Partial<InsertReward>): Promise<Reward | undefined>;
  deleteReward(id: string): Promise<boolean>;

  createRewardRedemption(redemption: InsertRewardRedemption): Promise<RewardRedemption>;
  getRedemptionsByMember(memberId: string): Promise<RewardRedemption[]>;
}

export class MemStorage implements IStorage {
  private families: Map<string, Family>;
  private members: Map<string, Member>;
  private chores: Map<string, Chore>;
  private rewards: Map<string, Reward>;
  private redemptions: Map<string, RewardRedemption>;

  constructor() {
    this.families = new Map();
    this.members = new Map();
    this.chores = new Map();
    this.rewards = new Map();
    this.redemptions = new Map();
  }

  async createFamily(insertFamily: InsertFamily): Promise<Family> {
    const id = randomUUID();
    const family: Family = {
      ...insertFamily,
      id,
      createdAt: new Date(),
    };
    this.families.set(id, family);
    return family;
  }

  async getFamilyByCode(code: string): Promise<Family | undefined> {
    return Array.from(this.families.values()).find(
      (family) => family.code === code
    );
  }

  async getFamily(id: string): Promise<Family | undefined> {
    return this.families.get(id);
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    const id = randomUUID();
    const member: Member = {
      ...insertMember,
      id,
      isParent: insertMember.isParent ?? false,
      weeklyPoints: 0,
      totalPoints: 0,
      streak: 0,
      createdAt: new Date(),
    };
    this.members.set(id, member);
    return member;
  }

  async getMember(id: string): Promise<Member | undefined> {
    return this.members.get(id);
  }

  async getMembersByFamily(familyId: string): Promise<Member[]> {
    return Array.from(this.members.values()).filter(
      (member) => member.familyId === familyId
    );
  }

  async updateMemberPoints(
    id: string,
    weeklyPoints: number,
    totalPoints: number
  ): Promise<Member | undefined> {
    const member = this.members.get(id);
    if (!member) return undefined;
    const updated = { ...member, weeklyPoints, totalPoints };
    this.members.set(id, updated);
    return updated;
  }

  async updateMemberStreak(id: string, streak: number): Promise<Member | undefined> {
    const member = this.members.get(id);
    if (!member) return undefined;
    const updated = { ...member, streak };
    this.members.set(id, updated);
    return updated;
  }

  async resetWeeklyPoints(familyId: string): Promise<void> {
    const members = await this.getMembersByFamily(familyId);
    for (const member of members) {
      const updated = { ...member, weeklyPoints: 0 };
      this.members.set(member.id, updated);
    }
  }

  async createChore(insertChore: InsertChore): Promise<Chore> {
    const id = randomUUID();
    const chore: Chore = {
      ...insertChore,
      id,
      assignedToId: insertChore.assignedToId ?? null,
      assignedById: insertChore.assignedById ?? null,
      completedById: insertChore.completedById ?? null,
      status: "available",
      createdAt: new Date(),
      completedAt: null,
    };
    this.chores.set(id, chore);
    return chore;
  }

  async getChore(id: string): Promise<Chore | undefined> {
    return this.chores.get(id);
  }

  async getChoresByFamily(familyId: string): Promise<Chore[]> {
    return Array.from(this.chores.values()).filter(
      (chore) => chore.familyId === familyId
    );
  }

  async updateChoreStatus(
    id: string,
    status: string,
    completedById?: string
  ): Promise<Chore | undefined> {
    const chore = this.chores.get(id);
    if (!chore) return undefined;
    const updated = {
      ...chore,
      status,
      completedById: completedById || chore.completedById,
      completedAt: status === "completed" || status === "pending" ? new Date() : chore.completedAt,
    };
    this.chores.set(id, updated);
    return updated;
  }

  async assignChore(
    id: string,
    assignedToId: string,
    assignedById: string
  ): Promise<Chore | undefined> {
    const chore = this.chores.get(id);
    if (!chore) return undefined;
    const updated = {
      ...chore,
      assignedToId,
      assignedById,
      status: "assigned",
    };
    this.chores.set(id, updated);
    return updated;
  }

  async deleteChore(id: string): Promise<boolean> {
    return this.chores.delete(id);
  }

  async createReward(insertReward: InsertReward): Promise<Reward> {
    const id = randomUUID();
    const reward: Reward = {
      ...insertReward,
      id,
      createdAt: new Date(),
    };
    this.rewards.set(id, reward);
    return reward;
  }

  async getReward(id: string): Promise<Reward | undefined> {
    return this.rewards.get(id);
  }

  async getRewardsByFamily(familyId: string): Promise<Reward[]> {
    return Array.from(this.rewards.values()).filter(
      (reward) => reward.familyId === familyId
    );
  }

  async updateReward(
    id: string,
    updates: Partial<InsertReward>
  ): Promise<Reward | undefined> {
    const reward = this.rewards.get(id);
    if (!reward) return undefined;
    const updated = { ...reward, ...updates };
    this.rewards.set(id, updated);
    return updated;
  }

  async deleteReward(id: string): Promise<boolean> {
    return this.rewards.delete(id);
  }

  async createRewardRedemption(
    insertRedemption: InsertRewardRedemption
  ): Promise<RewardRedemption> {
    const id = randomUUID();
    const redemption: RewardRedemption = {
      ...insertRedemption,
      id,
      redeemedAt: new Date(),
    };
    this.redemptions.set(id, redemption);
    return redemption;
  }

  async getRedemptionsByMember(memberId: string): Promise<RewardRedemption[]> {
    return Array.from(this.redemptions.values()).filter(
      (redemption) => redemption.memberId === memberId
    );
  }
}

import { db } from "./db.js";
import { families, members, chores, rewards, rewardRedemptions } from "../shared/schema.js";
import { eq, and } from "drizzle-orm";

export class DbStorage implements IStorage {
  async createFamily(insertFamily: InsertFamily): Promise<Family> {
    const [family] = await db.insert(families).values(insertFamily).returning();
    return family;
  }

  async getFamilyByCode(code: string): Promise<Family | undefined> {
    const [family] = await db.select().from(families).where(eq(families.code, code));
    return family;
  }

  async getFamily(id: string): Promise<Family | undefined> {
    const [family] = await db.select().from(families).where(eq(families.id, id));
    return family;
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    const [member] = await db.insert(members).values(insertMember).returning();
    return member;
  }

  async getMember(id: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member;
  }

  async getMembersByFamily(familyId: string): Promise<Member[]> {
    return db.select().from(members).where(eq(members.familyId, familyId));
  }

  async updateMemberPoints(id: string, weeklyPoints: number, totalPoints: number): Promise<Member | undefined> {
    const [member] = await db.update(members).set({ weeklyPoints, totalPoints }).where(eq(members.id, id)).returning();
    return member;
  }

  async updateMemberStreak(id: string, streak: number): Promise<Member | undefined> {
    const [member] = await db.update(members).set({ streak }).where(eq(members.id, id)).returning();
    return member;
  }

  async resetWeeklyPoints(familyId: string): Promise<void> {
    await db.update(members).set({ weeklyPoints: 0 }).where(eq(members.familyId, familyId));
  }

  async createChore(insertChore: InsertChore): Promise<Chore> {
    const [chore] = await db.insert(chores).values(insertChore).returning();
    return chore;
  }

  async getChore(id: string): Promise<Chore | undefined> {
    const [chore] = await db.select().from(chores).where(eq(chores.id, id));
    return chore;
  }

  async getChoresByFamily(familyId: string): Promise<Chore[]> {
    return db.select().from(chores).where(eq(chores.familyId, familyId));
  }

  async updateChoreStatus(id: string, status: string, completedById?: string): Promise<Chore | undefined> {
    const updateData: any = { status };
    if (completedById) {
      updateData.completedById = completedById;
    }
    if (status === "pending") {
      updateData.completedAt = new Date();
    }
    const [chore] = await db.update(chores).set(updateData).where(eq(chores.id, id)).returning();
    return chore;
  }

  async assignChore(id: string, assignedToId: string, assignedById: string): Promise<Chore | undefined> {
    const [chore] = await db.update(chores).set({ assignedToId, assignedById }).where(eq(chores.id, id)).returning();
    return chore;
  }

  async deleteChore(id: string): Promise<boolean> {
    const result = await db.delete(chores).where(eq(chores.id, id));
    return true;
  }

  async createReward(insertReward: InsertReward): Promise<Reward> {
    const [reward] = await db.insert(rewards).values(insertReward).returning();
    return reward;
  }

  async getReward(id: string): Promise<Reward | undefined> {
    const [reward] = await db.select().from(rewards).where(eq(rewards.id, id));
    return reward;
  }

  async getRewardsByFamily(familyId: string): Promise<Reward[]> {
    return db.select().from(rewards).where(eq(rewards.familyId, familyId));
  }

  async updateReward(id: string, updates: Partial<InsertReward>): Promise<Reward | undefined> {
    const [reward] = await db.update(rewards).set(updates).where(eq(rewards.id, id)).returning();
    return reward;
  }

  async deleteReward(id: string): Promise<boolean> {
    await db.delete(rewards).where(eq(rewards.id, id));
    return true;
  }

  async createRewardRedemption(insertRedemption: InsertRewardRedemption): Promise<RewardRedemption> {
    const [redemption] = await db.insert(rewardRedemptions).values(insertRedemption).returning();
    return redemption;
  }

  async getRedemptionsByMember(memberId: string): Promise<RewardRedemption[]> {
    return db.select().from(rewardRedemptions).where(eq(rewardRedemptions.memberId, memberId));
  }
}

export const storage = new DbStorage();
