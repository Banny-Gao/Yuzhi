import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateSolarTermColumnTypes1711460045372 implements MigrationInterface {
  name = 'UpdateSolarTermColumnTypes1711460045372'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 修改des字段为text类型
    await queryRunner.query(`ALTER TABLE \`solar_terms\` MODIFY COLUMN \`des\` TEXT NOT NULL`)

    // 修改youLai字段为text类型
    await queryRunner.query(`ALTER TABLE \`solar_terms\` MODIFY COLUMN \`youLai\` TEXT NOT NULL`)

    // 修改xiSu字段为text类型
    await queryRunner.query(`ALTER TABLE \`solar_terms\` MODIFY COLUMN \`xiSu\` TEXT NOT NULL`)

    // 修改heath字段为text类型
    await queryRunner.query(`ALTER TABLE \`solar_terms\` MODIFY COLUMN \`heath\` TEXT NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 回滚xiSu字段类型
    await queryRunner.query(`ALTER TABLE \`solar_terms\` MODIFY COLUMN \`xiSu\` VARCHAR(255) NOT NULL`)

    // 回滚youLai字段类型
    await queryRunner.query(`ALTER TABLE \`solar_terms\` MODIFY COLUMN \`youLai\` VARCHAR(255) NOT NULL`)

    // 回滚des字段类型
    await queryRunner.query(`ALTER TABLE \`solar_terms\` MODIFY COLUMN \`des\` VARCHAR(255) NOT NULL`)

    // 回滚heath字段类型
    await queryRunner.query(`ALTER TABLE \`solar_terms\` MODIFY COLUMN \`heath\` VARCHAR(255) NOT NULL`)
  }
}
