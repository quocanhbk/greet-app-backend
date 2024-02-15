import { RelationQueryBuilder } from "typeorm"

declare module "typeorm/query-builder/RelationQueryBuilder" {
  interface RelationQueryBuilder<Entity> {
    /** Run callback when condition is true */
    when(
      this: RelationQueryBuilder<Entity>,
      condition: any,
      callback: (qb: RelationQueryBuilder<Entity>) => RelationQueryBuilder<Entity> | Promise<void>,
      elseCallback?: (qb: RelationQueryBuilder<Entity>) => RelationQueryBuilder<Entity> | Promise<void>
    ): RelationQueryBuilder<Entity> | Promise<void>
  }
}

RelationQueryBuilder.prototype.when = function <Entity>(
  this: RelationQueryBuilder<Entity>,
  condition: any,
  callback: (qb: RelationQueryBuilder<Entity>) => RelationQueryBuilder<Entity> | Promise<void>,
  elseCallback?: (qb: RelationQueryBuilder<Entity>) => RelationQueryBuilder<Entity> | Promise<void>
): RelationQueryBuilder<Entity> | Promise<void> {
  if (condition) return callback(this)
  if (elseCallback) return elseCallback(this)
  return this
}
