# user

role: string['buyer', 'seller', 'admin']
name(담당자명): string
email(이메일): string
loginId(아이디): string
password(비밀번호): string
phone(휴대전화): string
authKey(카카오 아이디, 패스 인증번호): string
profileImage: object(s3file)

buyerInfo: {
  businessName(기업명): string
  businessType(기업형태): string
  ceoName(대표자명): string
  typeOfBusiness(업종형태): string
  previousYearSales(전년도 매출액): number
}

sellerInfo: {
  bank(은행): string
  accountNumber(계좌번호): string
  bankBookImage(통장 사본): object(s3file)
  idImage(신분증): object(s3file)
  typeOfMarketer: {
    ex) viral: "text"
  }(마케터 분야): object
  snsAccount(sns 계정): object
  recommender(추천인): string,
  point: number
}

# project
project: {
  userId: objectId,
  contractInfo: {
    contractName: string
    contractAmount: number
    projectPeriod: number
    contractDate: date
    projectStartedDate: date
    projectEndDate: date
  },
  matchingInfo: {
    title: string,
    status: string,
    hopeMarketing: string,
    managerName: string,
    managerPhone: string,
    proposal: object(s3File),
    contract: object(s3File)
  },
  clientInfo: {
    businessName: string,
    ceoName: string,
    previousYearSales: number,
    typeOfBusiness: string,
    name: string,
    phone: string,
    email: string,
  },
  previousMarketing: {
    purpose: srting,
    budget: number,
    period: number,
    description: string,
    isInception: boolean,
  },
  marketerList?: [
    viral?: [
        {
          userId: ObjectId,
          point: number,
          interimReport?: object,
          resultReport?: object,
        },
    ],
    performance?: [
      {
        userId: ObjectId,
        point: number,
        interimReport?: object,
        resultReport?: object,
      },
    ],
    store?: [
      {
          userId: ObjectId,
          point: number,
          interimReport?: object,
          resultReport?: object,
        },
      ],
    funding?: [
        {
          userId: ObjectId,
          point: number,
          interimReport?: object,
          resultReport?: object,
        },
      ],
    mediaReport?: [
      {
        userId: ObjectId,
        point: number,
        interimReport?: object,
        resultReport?: object,
      },
    ],
    contents?: [
      {
        userId: ObjectId,
        point: number,
        interimReport?: object,
        resultReport?: object,
      },
    ],
  ],
}

# settlement(정산)
{
  id: ObjectId,
  createdAt: date,
  amount: number,
  status: string,
  applicant: string,
  applicantAccountNumber: string,
  applicantBank: string,
  memo: string,
  taxBill: object(s3File),
}
