import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RealEstateTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  umdNm: string; // 법정동

  @Column()
  roadNm: string; // 도로명

  @Column()
  aptNm: string; // 아파트명

  @Column()
  excluUseAr: string; // 전용면적

  @Column()
  dealYear: string; // 계약년도

  @Column()
  dealMonth: string; // 계약월

  @Column()
  dealDay: string; // 계약일

  @Column()
  dealAmount: string; // 거래금액(만원)
}
