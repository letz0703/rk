import type {Config} from "tailwindcss"
import {fontFamily} from "tailwindcss/defaultTheme"

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    // 1. 기존 shadcn/ui의 컨테이너 설정 유지
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      // 2. Stitch 전용 폰트 설정 (Noto Serif & Plus Jakarta Sans)
      fontFamily: {
        headline: ["var(--font-noto-serif)", ...fontFamily.serif],
        body: ["var(--font-plus-jakarta)", ...fontFamily.sans],
        sans: ["var(--font-sans)", ...fontFamily.sans]
      },
      // 3. Stitch의 'Modern Heritage' 컬러 팔레트 강제 적용
      colors: {
        background: "#131313", // 최하단 배경 (surface)
        foreground: "#e5e2e1", // 기본 글자색 (on-surface)

        primary: {
          DEFAULT: "#f2ca50", // 메인 골드 컬러
          foreground: "#3c2f00",
          container: "#d4af37" // 그라데이션용 진한 골드
        },

        // 계층적 다크 레이어 (No-Line Rule 구현용)
        secondary: {
          DEFAULT: "#1c1b1b", // 중간 섹션 배경
          foreground: "#b4b5b5"
        },

        muted: {
          DEFAULT: "#2a2a2a", // 카드나 입력창 배경
          foreground: "#d0c5af"
        },

        accent: {
          DEFAULT: "#353534", // 강조 요소 배경
          foreground: "#f2ca50"
        },

        // shadcn/ui 호환성 유지
        border: "#4d4635", // 은은한 골드빛 테두리
        input: "#353534",
        ring: "#f2ca50",

        card: {
          DEFAULT: "#1c1b1b",
          foreground: "#e5e2e1"
        },
        popover: {
          DEFAULT: "#131313",
          foreground: "#e5e2e1"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        }
      },
      // 4. Stitch 지침: 부티크 느낌의 날카롭고 절제된 곡률
      borderRadius: {
        lg: "0.25rem",
        md: "0.125rem",
        sm: "0.0625rem",
        full: "9999px"
      },
      // 5. 골드 틴트 쉐도우 (Luxury Glow)
      boxShadow: {
        "gold-glow": "0 0 40px -10px rgba(242, 202, 80, 0.15)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
} satisfies Config
