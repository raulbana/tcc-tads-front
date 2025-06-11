export interface Typography {
  paragraph: {
    sm1: string;
    sm2: string;
    sm3: string;
    sm4: string;
    sm5: string;
    r1: string;
    r2: string;
    r3: string;
    r4: string;
    r5: string;
    sb1: string;
    sb2: string;
    sb3: string;
    sb4: string;
    sb5: string;
    b1: string;
    b2: string;
    b3: string;
    b4: string;
    b5: string;
    m1: string;
    m2: string;
    m3: string;
    m4: string;
    m5: string;
  };
  title: {
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    b1: string;
    b2: string;
    b3: string;
    b4: string;
    b5: string;
    sb1: string;
    sb2: string;
    sb3: string;
    sb4: string;
    sb5: string;
  };
}

const typography: Typography = {
  paragraph: {
    sm1: "text-sm1 font-normal font-inter leading-[16px]",
    sm2: "text-sm2 font-normal font-inter leading-[18px]",
    sm3: "text-sm3 font-normal font-inter leading-[20px]",
    sm4: "text-sm4 font-normal font-inter leading-[22px]",
    sm5: "text-sm5 font-normal font-inter leading-[24px]",

    r1: "text-r1 font-normal font-inter leading-[16px]",
    r2: "text-r2 font-normal font-inter leading-[18px]",
    r3: "text-r3 font-normal font-inter leading-[20px]",
    r4: "text-r4 font-normal font-inter leading-[22px]",
    r5: "text-r5 font-normal font-inter leading-[24px]",

    sb1: "text-sb1 font-semibold font-inter leading-[16px]",
    sb2: "text-sb2 font-semibold font-inter leading-[18px]",
    sb3: "text-sb3 font-semibold font-inter leading-[20px]",
    sb4: "text-sb4 font-semibold font-inter leading-[22px]",
    sb5: "text-sb5 font-semibold font-inter leading-[24px]",

    b1: "text-b1 font-bold font-inter leading-[16px]",
    b2: "text-b2 font-bold font-inter leading-[18px]",
    b3: "text-b3 font-bold font-inter leading-[20px]",
    b4: "text-b4 font-bold font-inter leading-[22px]",
    b5: "text-b5 font-bold font-inter leading-[24px]",

    m1: "text-m1 font-medium font-inter leading-[16px]",
    m2: "text-m2 font-medium font-inter leading-[18px]",
    m3: "text-m3 font-medium font-inter leading-[20px]",
    m4: "text-m4 font-medium font-inter leading-[22px]",
    m5: "text-m5 font-medium font-inter leading-[24px]",
  },
  title: {
    h1: "text-h1 font-bold font-inter leading-[36px]",
    h2: "text-h2 font-bold font-inter leading-[32px]",
    h3: "text-h3 font-bold font-inter leading-[28px]",
    h4: "text-h4 font-bold font-inter leading-[24px]",
    h5: "text-h5 font-bold font-inter leading-[22px]",

    b1: "text-h1 font-semibold font-inter leading-[36px]",
    b2: "text-h2 font-semibold font-inter leading-[32px]",
    b3: "text-h3 font-semibold font-inter leading-[28px]",
    b4: "text-h4 font-semibold font-inter leading-[24px]",
    b5: "text-h5 font-semibold font-inter leading-[22px]",

    sb1: "text-h1 font-medium font-inter leading-[36px]",
    sb2: "text-h2 font-medium font-inter leading-[32px]",
    sb3: "text-h3 font-medium font-inter leading-[28px]",
    sb4: "text-h4 font-medium font-inter leading-[24px]",
    sb5: "text-h5 font-medium font-inter leading-[22px]",
  },
};

export type TypographyItem = keyof Typography['paragraph'] | keyof Typography['title'];

export default typography;