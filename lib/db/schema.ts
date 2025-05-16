import { pgTable, integer, boolean, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { Relation, relations } from "drizzle-orm";

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  path: text("path").notNull(),
  size: integer("size").notNull(),
  type: text("type").notNull(),
  fileUrl: text("fileUrl").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  user_id: text("User_id").notNull(),
  parent_id: uuid("Parent_id").notNull(),
  isFolder: boolean("is_folder").default(false).notNull(),
  isStarred: boolean("is_Starred").default(false).notNull(),
  isTrash: boolean("is_Trash").default(false).notNull(),
  createdAt: timestamp("created_At").notNull().defaultNow(),
  updatedAt: timestamp("Updated_At").notNull().defaultNow(),
});


export const fileRelation = relations(files, ({ one, many }) => ({
  parent: one(files, {
    fields: [files.parent_id],
    references: [files.id],
  }),
  children: many(files),
}));

export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;