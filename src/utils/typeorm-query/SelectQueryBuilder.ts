import { WhereExpressionBuilder, ObjectLiteral, SelectQueryBuilder, Brackets } from "typeorm"

declare module "typeorm/query-builder/SelectQueryBuilder" {
  interface SelectQueryBuilder<Entity> {
    /** Run callback when condition is true */
    when(
      this: SelectQueryBuilder<Entity>,
      condition: any,
      callback: (qb: SelectQueryBuilder<Entity>) => SelectQueryBuilder<Entity>,
      elseCallback?: (qb: SelectQueryBuilder<Entity>) => SelectQueryBuilder<Entity>
    ): SelectQueryBuilder<Entity>
    /** Group where clauses by parenthesis */
    whereGroup(
      this: SelectQueryBuilder<Entity>,
      callback: (qb: WhereExpressionBuilder) => any,
      parameters?: ObjectLiteral
    ): SelectQueryBuilder<Entity>
    /** Group where clauses by parenthesis */
    orWhereGroup(
      this: SelectQueryBuilder<Entity>,
      callback: (qb: WhereExpressionBuilder) => any,
      parameters?: ObjectLiteral
    ): SelectQueryBuilder<Entity>
    /** Group where clauses by parenthesis */
    andWhereGroup(
      this: SelectQueryBuilder<Entity>,
      callback: (qb: WhereExpressionBuilder) => any,
      parameters?: ObjectLiteral
    ): SelectQueryBuilder<Entity>
    /** Exists */
    isExisted(): Promise<boolean>
  }
}

SelectQueryBuilder.prototype.when = function <Entity>(
  this: SelectQueryBuilder<Entity>,
  condition: any,
  callback: (qb: SelectQueryBuilder<Entity>) => SelectQueryBuilder<Entity>,
  elseCallback?: (qb: SelectQueryBuilder<Entity>) => SelectQueryBuilder<Entity>
): SelectQueryBuilder<Entity> {
  if (condition) return callback(this)
  if (elseCallback) return elseCallback(this)
  return this
}

SelectQueryBuilder.prototype.whereGroup = function <Entity>(
  this: SelectQueryBuilder<Entity>,
  callback: (qb: WhereExpressionBuilder) => any,
  parameters?: ObjectLiteral
): SelectQueryBuilder<Entity> {
  return this.where(new Brackets(callback), parameters)
}

SelectQueryBuilder.prototype.orWhereGroup = function <Entity>(
  this: SelectQueryBuilder<Entity>,
  callback: (qb: WhereExpressionBuilder) => any,
  parameters?: ObjectLiteral
): SelectQueryBuilder<Entity> {
  return this.orWhere(new Brackets(callback), parameters)
}

SelectQueryBuilder.prototype.andWhereGroup = function <Entity>(
  this: SelectQueryBuilder<Entity>,
  callback: (qb: WhereExpressionBuilder) => any,
  parameters?: ObjectLiteral
): SelectQueryBuilder<Entity> {
  return this.andWhere(new Brackets(callback), parameters)
}

SelectQueryBuilder.prototype.isExisted = async function (): Promise<boolean> {
  const isExistsQuery = (query: string) => `CASE WHEN EXISTS(${query}) THEN 1 ELSE 0 END AS "exists"`
  const result = await this.select(isExistsQuery(this.getQuery())).where("").take(1).getRawOne()
  return result?.exists === 1
}
