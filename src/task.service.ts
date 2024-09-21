import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealEstateTransaction } from './real-estate-transaction.entity';
import axios from 'axios';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(RealEstateTransaction)
    private transactionRepository: Repository<RealEstateTransaction>,
  ) {}

  // 매일 오전 2시에 실행 (cron 표현식: '0 2 * * *')
  @Cron('*/1 * * * *')
  async handleCron() {
    console.log('스케줄링 작업 실행 중...');
    const data = await this.fetchData();
    await this.saveToDatabase(data);
  }

  // API 데이터를 불러오는 함수
  async fetchData(): Promise<Partial<RealEstateTransaction>[]> {
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
    const LAWD_CD = '11110';
    const DEAL_YMD = '202409';
    const pageNo = 1;
    const numOfRows = 10;

    const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey=${API_KEY}&LAWD_CD=${LAWD_CD}&DEAL_YMD=${DEAL_YMD}&pageNo=${pageNo}&numOfRows=${numOfRows}`;

    try {
      const response = await axios.get(url);

      // API 응답이 이미 JSON이므로 그대로 사용
      const jsonData = response.data;
      console.log('API 응답 JSON:', JSON.stringify(jsonData, null, 2)); // 응답 내용 확인

      const items = jsonData.response.body.items;

      if (items && items.item) {
        const itemArray = Array.isArray(items.item) ? items.item : [items.item];
        return itemArray.map((item: any) => ({
          umdNm: item.umdNm || '알수없음', // 필드명 확인 후 기본값 설정
          roadNm: item.roadNm || '알수없음',
          aptNm: item.aptNm || '알수없음',
          excluUseAr: item.excluUseAr || '0',
          dealYear: item.dealYear || '2020',
          dealMonth: item.dealMonth || '01',
          dealDay: item.dealDay || '01',
          dealAmount: item.dealAmount || '0',
        }));
      } else {
        console.error('API 응답에 데이터가 없습니다.');
        return [];
      }
    } catch (error) {
      console.error('API 요청 실패:', error.message);
      return [];
    }
  }

  // 데이터를 데이터베이스에 저장하는 함수
  async saveToDatabase(items: Partial<RealEstateTransaction>[]) {
    for (const item of items) {
      await this.transactionRepository.save(item);
    }
    console.log('데이터 저장 완료');
  }
}
