'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Activity, Scale, Brain, Dna, Moon, ChevronDown, ChevronUp, Stethoscope, FileText, Users, Building2, BookOpen, UserCheck, HeartHandshake, Shield, Utensils } from 'lucide-react'
import { useState } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import HASupportChatbot from '@/components/ui/ha-support-chatbot'

export default function LearnMore() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const fadeInUpFast = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const staggerContainerFast = {
    animate: {
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const factors = [
    {
      icon: Heart,
      title: "Eating & Nutrition",
      description: "Restrictive eating patterns, whether from eating disorders, diet culture, food fears, or simply inadequate intake, can trigger HA. This includes caloric restriction, eliminating food groups, or having rigid food rules that create energy deficiency.",
      encouragement: "Nourishing your body with adequate, varied nutrition is an act of self-care and healing."
    },
    {
      icon: Activity,
      title: "Exercise & Movement",
      description: "Excessive exercise relative to energy intake can contribute to HA. This affects not just competitive athletes, but also fitness enthusiasts, those using exercise to manage body image concerns, or anyone with compulsive exercise patterns.",
      encouragement: "Gentle, joyful movement that honors your body's needs supports both physical and mental well-being."
    },
    {
      icon: Scale,
      title: "Body Weight & Image",
      description: "Significant weight loss, body dysmorphia, or being below your natural set point can trigger HA. This affects people across the weight spectrum - HA isn't limited to those who are underweight.",
      encouragement: "Your body deserves respect and care at every size. Healing your relationship with your body is part of recovery."
    },
    {
      icon: Brain,
      title: "Stress & Mental Health",
      description: "Chronic stress, perfectionism, anxiety, depression, trauma, major life changes, or overwhelming academic/work pressures can all contribute to HA by disrupting the hypothalamic-pituitary axis.",
      encouragement: "Mental health support and stress management are essential components of healing and recovery."
    },
    {
      icon: Dna,
      title: "Individual Factors",
      description: "Genetics, personality traits (like perfectionism), sensitivity to stress, metabolic factors, and individual hormone sensitivity all influence HA risk. Some people may be more susceptible than others.",
      encouragement: "Understanding your unique factors helps create a personalized, compassionate approach to recovery."
    },
    {
      icon: Moon,
      title: "Sleep & Circadian Health",
      description: "Poor sleep quality, irregular sleep schedules, chronic sleep deprivation, or disrupted circadian rhythms can significantly impact hormonal regulation. Sleep disruption affects cortisol patterns, melatonin production, and reproductive hormone pulsatility.",
      encouragement: "Prioritizing quality sleep and healthy sleep patterns supports your body's natural healing and hormone regulation."
    }
  ]

  const faqData = [
    {
      question: "How long does it take to recover from HA?",
      answer: "Recovery timeline varies greatly between individuals. Some women see their periods return within 3-6 months, while others may take 12-18 months or longer. Factors affecting recovery time include how long you've had HA, the severity of underlying causes, and how consistently you address the contributing factors. Remember, recovery isn't just about getting your period back - it's about restoring overall hormonal and metabolic health."
    },
    {
      question: "Do I really need to gain weight to recover?",
      answer: "Not everyone with HA needs to gain weight, but many do. Weight restoration depends on your individual situation - whether you've experienced recent weight loss, are below your natural set point, or have a history of restrictive eating. HA can affect people across the weight spectrum, including those at 'normal' weights. Recovery often requires returning to your body's natural set point, which may be higher than your current weight. A registered dietitian experienced with HA can help determine what's right for your individual recovery."
    },
    {
      question: "Can I still exercise during HA recovery?",
      answer: "Exercise modification is often necessary during recovery. High-intensity or excessive exercise can suppress reproductive hormones. Many healthcare providers recommend reducing exercise intensity and duration, or taking a complete break from structured exercise. Gentle movement like walking, restorative yoga, or light stretching may be appropriate. The key is listening to your body and working with your healthcare team."
    },
    {
      question: "Will my periods return to normal after recovery?",
      answer: "Most women who recover from HA do see their periods return and can have normal menstrual cycles. However, it may take time for cycles to become regular and ovulatory. Some women may experience irregular cycles initially as their hormones rebalance. Long-term, most women with recovered HA can conceive and have healthy pregnancies, though it's important to maintain the lifestyle changes that supported recovery."
    },
    {
      question: "What should I eat during HA recovery?",
      answer: "Recovery nutrition focuses on adequacy, variety, and healing your relationship with food. This means eating enough calories to support your body's needs, including all food groups without restriction, and challenging food fears or rules that may have contributed to HA. For those with eating disorder histories, this process requires specialized support. Focus on mechanical eating (eating regardless of hunger cues), including feared foods, and prioritizing nourishment over 'health' rules. A registered dietitian experienced with HA and eating disorders is essential for personalized guidance."
    },
    {
      question: "Can stress alone cause HA?",
      answer: "Severe chronic stress can contribute significantly to HA, especially when combined with other factors. This includes academic pressure, work stress, perfectionism, trauma, major life changes, mental health conditions, or family dynamics. For some people, psychological stress may be the primary driver, while others may have multiple contributing factors including nutrition, exercise, or body image concerns. Mental health support, therapy, and stress management are crucial components of recovery for everyone with HA."
    },
    {
      question: "Is HA the same as PCOS?",
      answer: "No, HA and PCOS are different conditions with opposite underlying mechanisms. HA involves suppressed reproductive hormones due to energy deficiency or stress, while PCOS typically involves elevated androgens and insulin resistance. However, some women may have been misdiagnosed with PCOS when they actually have HA, especially if they have irregular periods and are athletic or have a history of restrictive eating."
    },
    {
      question: "Do I need hormone therapy for HA?",
      answer: "Hormone therapy (like birth control pills) may be prescribed to protect bone health if natural periods don't return within a reasonable timeframe. However, hormonal contraception doesn't treat the underlying causes of HA and may mask whether recovery efforts are working. Many healthcare providers prefer to address root causes first and use hormone therapy as a protective measure if needed. Always discuss options with your healthcare provider."
    },
    {
      question: "Can I get pregnant with HA?",
      answer: "HA typically means you're not ovulating regularly, making natural conception difficult. However, fertility often returns with recovery. Some women may ovulate and conceive before their periods return, so it's important to discuss contraception with your healthcare provider if pregnancy isn't desired. If you're trying to conceive, focus on recovery first, as this gives you the best chance of a healthy pregnancy."
    },
    {
      question: "What tests will my doctor run for HA?",
      answer: "Diagnosis typically involves blood tests to check hormone levels (FSH, LH, estrogen, prolactin, thyroid hormones), rule out other conditions, and assess overall health. Your doctor may also check vitamin D, bone density (DEXA scan), and other nutrients. A detailed history about your eating, exercise, stress levels, and menstrual history is equally important. HA is often a diagnosis of exclusion, meaning other causes of amenorrhea are ruled out first."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const resources = [
    {
      name: "Endocrinology Society Guidelines",
      description: "Look for evidence-based clinical practice guidelines on functional hypothalamic amenorrhea from professional endocrinology organizations.",
      icon: BookOpen
    },
    {
      name: "Obstetrics & Gynecology Resources",
      description: "Patient education materials from reputable OB/GYN organizations about amenorrhea causes and treatment options.",
      icon: FileText
    },
    {
      name: "Reproductive Endocrinologists",
      description: "Specialists who focus on hormone-related reproductive health issues and can provide expert diagnosis and treatment.",
      icon: Brain
    },
    {
      name: "Women's Health Organizations",
      description: "Government and non-profit women's health resources that provide accessible information about menstrual health.",
      icon: Heart
    },
    {
      name: "Medical Centers & Hospitals",
      description: "Trusted medical institutions like Mayo Clinic, Cleveland Clinic, and academic medical centers with HA information.",
      icon: Building2
    },
    {
      name: "Registered Dietitians",
      description: "Nutrition professionals with specialized training in eating disorders and reproductive health nutrition.",
      icon: Utensils
    },
    {
      name: "Eating Disorder Support Organizations",
      description: "National and local organizations providing helplines, resources, and support for eating disorder-related HA.",
      icon: HeartHandshake
    },
    {
      name: "Mental Health Professionals",
      description: "Therapists and counselors experienced in body image, eating disorders, perfectionism, and stress management.",
      icon: UserCheck
    },
    {
      name: "Support Groups & Communities",
      description: "Online and in-person support groups for individuals experiencing HA and related recovery challenges.",
      icon: Users
    }
  ]

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
        {/* Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-[#87C4BB] origin-left z-50"
          style={{ scaleX }}
        />

      {/* Hero Section */}
      <section className="relative pb-20 px-4 bg-gradient-to-br from-[#F7F7F7] to-[#F0F8F7]" style={{paddingTop: '100px'}}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-[#333333] mb-6 leading-tight">
              A Guide to Hypothalamic Amenorrhea
              <span className="block text-[#87C4BB] text-3xl md:text-4xl mt-2">
                Missing Periods
              </span>
            </h1>
            <p className="text-xl text-[#666666] mb-8 max-w-3xl mx-auto leading-relaxed">
            Understanding causes, health risks, and recovery path for everyone affected by HA
            </p>
            <img 
              src="/meditation-wellness.png" 
              alt="Person meditating peacefully at sunset, representing wellness and healing journey"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </motion.div>
          
          {/* Horizontal divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 mb-8"
          >
            <div className="max-w-4xl mx-auto px-4">
              <div className="relative">
                <hr className="border-0 h-0.5 bg-gradient-to-r from-transparent via-[#87C4BB]/60 to-transparent" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 bg-[#87C4BB] rounded-full shadow-lg"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Basics of HA Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#333333] mb-4">
              What is Hypothalamic Amenorrhea?
            </h2>
            <p className="text-xl text-[#666666] max-w-3xl mx-auto">
              Understanding the condition that affects your body's natural rhythms
            </p>
          </motion.div>

          {/* Main Definition Card */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="mb-8"
          >
            <Card className="border-[#87C4BB]/20 shadow-lg bg-gradient-to-br from-white to-[#F0F8F7]">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#87C4BB] to-[#FFB4A2] flex items-center justify-center flex-shrink-0">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#333333] mb-4">The Medical Definition</h3>
                    <p className="text-lg text-[#666666] leading-relaxed">
                      Hypothalamic Amenorrhea (HA) occurs when your brain's hypothalamus - the control center 
                      for hormones - stops sending the signals needed to maintain your menstrual cycle. This 
                      results in missing periods for three months or more.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Who It Affects & Hope Message - Side by Side */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            {/* Who It Affects */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-[#FFB4A2]/20 shadow-lg bg-gradient-to-br from-white to-[#FFF8F5]">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFB4A2] to-[#C1A7E1] flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#333333] leading-tight">Who Does HA Affect?</h3>
                  </div>
                  <p className="text-[#666666] leading-relaxed">
                    HA affects people from diverse backgrounds and circumstances - athletes, individuals with eating disorders, 
                    those experiencing chronic stress, people with body dysmorphia, perfectionists, and anyone facing 
                    significant life pressures or energy imbalance.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Hope Message */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-[#87C4BB]/30 shadow-lg bg-gradient-to-br from-[#87C4BB]/5 to-[#87C4BB]/10">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#87C4BB] to-[#A8D5BA] flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#87C4BB] leading-tight">✨ The Hope-Filled Truth</h3>
                  </div>
                  <p className="text-[#333333] font-medium leading-relaxed">
                    HA is reversible in most cases. With the right approach, understanding, and support, 
                    your body can restore its natural hormonal balance and menstrual cycle.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Understanding & Compassion Message */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <Card className="border-[#C1A7E1]/20 shadow-lg bg-gradient-to-r from-[#C1A7E1]/5 via-white to-[#FFB4A2]/5">
              <CardContent className="p-8 text-center">
                <div className="max-w-4xl mx-auto">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#C1A7E1] to-[#FFB4A2] flex items-center justify-center">
                    <HeartHandshake className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#333333] mb-4">A Message of Understanding</h3>
                  <p className="text-lg text-[#666666] leading-relaxed">
                    Understanding HA starts with recognizing that it's your body's protective response to stress, 
                    inadequate nourishment, or overwhelming demands - <span className="font-semibold text-[#333333]">not a personal failure</span>, 
                    but a signal that deserves attention, compassion, and care.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* The 6 Factors Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-4xl font-bold text-center text-[#333333] mb-16"
          >
            The 6 Key Factors of HA
          </motion.h2>
          
          {/* First row - 3 factors */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
          >
            {factors.slice(0, 3).map((factor, index) => {
              const Icon = factor.icon
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full border-[#87C4BB]/20 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#87C4BB] to-[#FFB4A2] flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-[#333333]">
                        {index + 1}. {factor.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-[#666666] leading-relaxed mb-4 flex-1">
                        {factor.description}
                      </p>
                      <div className="bg-[#87C4BB]/10 rounded-lg p-4 border-l-4 border-[#87C4BB] mt-auto">
                        <p className="text-[#333333] font-medium text-sm">
                          💚 {factor.encouragement}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Second row - 3 factors */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {factors.slice(3, 6).map((factor, index) => {
              const Icon = factor.icon
              const actualIndex = index + 3
              return (
                <motion.div
                  key={actualIndex}
                  variants={fadeInUp}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full border-[#87C4BB]/20 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#87C4BB] to-[#FFB4A2] flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-[#333333]">
                        {actualIndex + 1}. {factor.title}
                      </CardTitle>
          </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-[#666666] leading-relaxed mb-4 flex-1">
                        {factor.description}
                      </p>
                      <div className="bg-[#87C4BB]/10 rounded-lg p-4 border-l-4 border-[#87C4BB] mt-auto">
                        <p className="text-[#333333] font-medium text-sm">
                          💚 {factor.encouragement}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Health Risks & Symptoms Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#333333] mb-6">
              Health Risks & Symptoms
            </h2>
            <p className="text-xl text-[#666666] max-w-4xl mx-auto leading-relaxed">
              HA affects your entire body, not just your menstrual cycle. Some consequences are immediately noticeable, 
              while others are serious health risks that develop silently over time.
            </p>
          </motion.div>
          
          {/* Immediate Symptoms */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainerFast}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-[#333333] mb-6 text-center">
              Symptoms You May Notice
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Loss of menstrual periods (3+ months)",
                "Chronic fatigue and low energy",
                "Hair loss or thinning",
                "Cold intolerance (always feeling cold)",
                "Sleep disturbances and insomnia",
                "Mood changes, irritability, anxiety",
                "Loss of libido and sexual interest",
                "Digestive issues and bloating",
                "Frequent injuries or slow healing",
                "Brain fog and difficulty concentrating",
                "Dry skin and brittle nails",
                "Constipation and digestive problems"
              ].map((symptom, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUpFast}
                  className="bg-white rounded-lg p-4 shadow-md border border-[#C1A7E1]/20"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#FFB4A2] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-[#333333] font-medium leading-relaxed text-sm">{symptom}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Serious Health Risks */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-[#333333] mb-6 text-center">
              Serious Health Risks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-lg p-6 shadow-lg border border-[#E87C7C]/30 border-l-4 border-l-[#E87C7C]"
              >
                <h4 className="text-xl font-bold text-[#E87C7C] mb-3">🦴 Bone Health</h4>
                <p className="text-[#333333] font-medium mb-2">Osteoporosis & Osteopenia</p>
                <p className="text-[#666666] text-sm leading-relaxed">
                  Low estrogen levels cause rapid bone loss, increasing fracture risk. This bone loss may be 
                  irreversible if HA continues long-term. Peak bone mass is typically achieved in your 20s-30s, 
                  making early intervention crucial.
                </p>
              </motion.div>
              
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-lg p-6 shadow-lg border border-[#E87C7C]/30 border-l-4 border-l-[#E87C7C]"
              >
                <h4 className="text-xl font-bold text-[#E87C7C] mb-3">🤰 Fertility</h4>
                <p className="text-[#333333] font-medium mb-2">Infertility & Pregnancy Complications</p>
                <p className="text-[#666666] text-sm leading-relaxed">
                  HA suppresses ovulation, making natural conception difficult or impossible. Even after recovery, 
                  some may face fertility challenges. Pregnancy during active HA increases risks of complications 
                  for both mother and baby.
                </p>
              </motion.div>
              
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-lg p-6 shadow-lg border border-[#E87C7C]/30 border-l-4 border-l-[#E87C7C]"
              >
                <h4 className="text-xl font-bold text-[#E87C7C] mb-3">❤️ Cardiovascular</h4>
                <p className="text-[#333333] font-medium mb-2">Heart Health & Blood Pressure</p>
                <p className="text-[#666666] text-sm leading-relaxed">
                  Low estrogen affects cardiovascular health, potentially leading to increased risk of heart disease 
                  later in life. Some experience low blood pressure, dizziness, and poor circulation.
                </p>
              </motion.div>
              
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-lg p-6 shadow-lg border border-[#E87C7C]/30 border-l-4 border-l-[#E87C7C]"
              >
                <h4 className="text-xl font-bold text-[#E87C7C] mb-3">🧠 Metabolic</h4>
                <p className="text-[#333333] font-medium mb-2">Hormonal & Metabolic Disruption</p>
                <p className="text-[#666666] text-sm leading-relaxed">
                  HA disrupts multiple hormone systems including thyroid, cortisol, and insulin regulation. 
                  This can lead to metabolic dysfunction that persists even after periods return.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How Our Product Helps Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#F7F7F7] to-[#F0F8F7]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="border-[#87C4BB]/30 shadow-xl">
              <CardContent className="p-10">
                <h2 className="text-4xl font-bold text-[#333333] mb-8">
                  How Pedal Supports Your Recovery
                </h2>
                <div className="space-y-6 text-lg">
                  <p className="text-[#666666] leading-relaxed">
                    <span className="font-semibold text-[#333333]">
                      Understanding HA is just the beginning.
                    </span> Pedal provides the tools and support you need to navigate your recovery journey with confidence and compassion.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="bg-[#87C4BB]/10 rounded-lg p-6 text-left">
                      <h3 className="font-bold text-[#333333] mb-3 text-xl">🌡️ Gentle Tracking</h3>
                      <p className="text-[#666666]">
                        Monitor your basal body temperature and symptoms without obsession. 
                        Our BBT tracker helps you understand your body's patterns while maintaining a healthy relationship with data.
                      </p>
                    </div>
                    <div className="bg-[#FFB4A2]/10 rounded-lg p-6 text-left">
                      <h3 className="font-bold text-[#333333] mb-3 text-xl">🍽️ Nourishment Focus</h3>
                      <p className="text-[#666666]">
                        Our Nourish & Thrive feature helps you rebuild a positive relationship with food, 
                        providing meal inspiration and gentle guidance without restriction or judgment.
                      </p>
                    </div>
                    <div className="bg-[#C1A7E1]/10 rounded-lg p-6 text-left">
                      <h3 className="font-bold text-[#333333] mb-3 text-xl">💜 Self-Love Space</h3>
                      <p className="text-[#666666]">
                        Cultivate self-compassion with daily affirmations and reflection tools. 
                        Your healing journey deserves kindness, and we provide the space for that growth.
                      </p>
                    </div>
                    <div className="bg-[#87C4BB]/10 rounded-lg p-6 text-left">
                      <h3 className="font-bold text-[#333333] mb-3 text-xl">📚 Education & Support</h3>
            <p className="text-[#666666]">
                        Access research-based information and connect with a community that understands. 
                        Knowledge and connection are powerful tools in your recovery toolkit.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-[#87C4BB]/20 rounded-lg p-6 border border-[#87C4BB]/30">
                    <p className="text-[#333333] font-bold text-xl mb-4">
                      🌟 Recovery is possible, and you don't have to do it alone
                    </p>
                    <p className="text-[#666666] mb-4">
                      Pedal combines evidence-based tracking with compassionate support, 
                      creating a safe space where healing can happen naturally.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#333333] mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-[#666666] max-w-3xl mx-auto leading-relaxed">
              Get answers to the most common questions about Hypothalamic Amenorrhea, 
              recovery, and what to expect on your healing journey.
            </p>
          </motion.div>
          
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-lg shadow-md border border-[#87C4BB]/20 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-[#87C4BB]/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#87C4BB]/20"
                >
                  <h3 className="text-lg font-semibold text-[#333333] pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-[#87C4BB]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#87C4BB]" />
                    )}
                  </div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: openFAQ === index ? "auto" : 0,
                    opacity: openFAQ === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 pt-2">
                    <div className="border-t border-[#87C4BB]/20 pt-4">
                      <p className="text-[#666666] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mt-12 text-center"
          >
            <div className="bg-[#FFB4A2]/20 rounded-lg p-6 max-w-3xl mx-auto border border-[#FFB4A2]/30">
              <p className="text-[#333333] font-medium text-lg mb-4">
                🤔 <strong>Have more questions?</strong>
              </p>
              <p className="text-[#666666] mb-4">
                Remember that every HA journey is unique. These answers provide general guidance, 
                but it's important to work with healthcare providers who understand HA for personalized advice.
              </p>
              <Button 
                className="bg-[#FFB4A2] hover:bg-[#FFB4A2]/90 text-white px-6 py-2 rounded-full"
                onClick={() => window.location.href = '/bbt-tracker'}
              >
                Start Tracking Your Journey
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#F8F6FF] to-[#F0F8F7]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#333333] mb-4">
              Helpful Resources & Support
            </h2>
            <p className="text-xl text-[#666666] max-w-3xl mx-auto leading-relaxed">
              Types of trusted medical and professional resources to look for when seeking HA guidance.
            </p>
          </motion.div>
          
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {resources.map((resource, index) => {
              const Icon = resource.icon
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full border-[#C1A7E1]/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C1A7E1] to-[#87C4BB] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[#333333] font-semibold text-lg leading-tight">
                            {resource.name}
                          </h3>
                        </div>
                      </div>
                      <p className="text-[#666666] leading-relaxed text-sm mt-auto">
                        {resource.description}
            </p>
          </CardContent>
        </Card>
                </motion.div>
              )
            })}
          </motion.div>
          
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mt-12"
          >
            <div className="bg-white/60 rounded-lg p-6 max-w-4xl mx-auto border border-[#C1A7E1]/20 backdrop-blur-sm">
              <p className="text-[#333333] font-medium text-lg mb-2">
                💡 <strong>Important Note</strong>
              </p>
              <p className="text-[#666666] leading-relaxed">
                These resources are for educational purposes. Always consult with qualified healthcare professionals 
                for personalized medical advice and treatment plans specific to your situation.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HA Support Chatbot - Only on Learn More page */}
      <HASupportChatbot />
      </div>
  )
}
