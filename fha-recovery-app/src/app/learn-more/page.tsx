'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Activity, Scale, Brain, Dna } from 'lucide-react'

export default function LearnMore() {
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

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const factors = [
    {
      icon: Heart,
      title: "Eating Habits",
      description: "Caloric and food group restrictions are common in women with HA. Research shows the average planned caloric intake was 1481 calories a day - a level usually recommended for weight loss, not maintenance.",
      encouragement: "Adequate nutrition is essential for hormonal health and recovery. Your body needs fuel to function optimally."
    },
    {
      icon: Activity,
      title: "Exercise",
      description: "Many women with HA exercise intensely. Research indicates that exercising 2+ hours daily, 7 days a week significantly increases HA risk. Exercise intensity often increases when periods stop.",
      encouragement: "Movement should bring joy and energy, not exhaustion. Finding balance is key to recovery."
    },
    {
      icon: Scale,
      title: "Weight and Weight Loss",
      description: "It's not just severely underweight women who develop HA. While 33% had a BMI less than 18.5, 67% had a BMI over 18.5. Importantly, 82% had lost 10+ pounds prior to developing HA.",
      encouragement: "Your worth is not determined by a number on a scale. Health comes in many shapes and sizes."
    },
    {
      icon: Brain,
      title: "Stress",
      description: "Both acute stressful events and chronic stress contribute to HA. The combination with other factors is particularly impactful. Many experience stress from trying to live up to perfectionist goals.",
      encouragement: "Learning to manage stress and practice self-compassion is a powerful step toward healing."
    },
    {
      icon: Dna,
      title: "Genetics",
      description: "Genetic mutations have been found in proteins involved in regulation of the menstrual cycle in women with HA. This suggests a potential genetic susceptibility to loss of periods.",
      encouragement: "Understanding genetic factors helps us approach recovery with patience and personalized care."
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
      <section className="relative py-20 px-4 bg-gradient-to-br from-[#87C4BB]/20 to-[#C1A7E1]/20">
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
              Understanding the 5 key factors and path to recovery
            </p>
            <div className="bg-white/80 rounded-lg p-6 max-w-2xl mx-auto border border-[#87C4BB]/20">
              <p className="text-[#333333] font-medium">
                HA is a component of the female athlete triad and relative energy deficiency in sport (RED-S)
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <Card className="border-[#87C4BB]/20 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-[#333333] mb-6">
                  Understanding Hypothalamic Amenorrhea
                </h2>
                <div className="space-y-4 text-lg text-[#666666] leading-relaxed">
                  <p>
                    Hypothalamic Amenorrhea occurs when hormonal signals from the hypothalamus - 
                    your brain's control center - are disrupted or shut off, causing menstrual periods to stop.
                  </p>
                  <p className="text-[#87C4BB] font-semibold">
                    The encouraging news: HA is reversible in most cases.
                  </p>
                  <p>
                    Research has identified five key factors that contribute to HA: eating habits, 
                    exercise patterns, weight changes, stress levels, and genetic predisposition.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* The 5 Factors Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-4xl font-bold text-center text-[#333333] mb-16"
          >
            The 5 Key Factors of HA
          </motion.h2>
          
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {factors.map((factor, index) => {
              const Icon = factor.icon
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className={index === 2 ? "lg:col-span-1 lg:col-start-2" : ""}
                >
                  <Card className="h-full border-[#87C4BB]/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#87C4BB] to-[#FFB4A2] flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-[#333333]">
                        {index + 1}. {factor.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-[#666666] leading-relaxed">
                        {factor.description}
                      </p>
                      <div className="bg-[#87C4BB]/10 rounded-lg p-4 border-l-4 border-[#87C4BB]">
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

      {/* Recovery Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#FFB4A2]/20 to-[#C1A7E1]/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="border-[#FFB4A2]/30 shadow-xl">
              <CardContent className="p-10">
                <h2 className="text-4xl font-bold text-[#333333] mb-8">
                  The Path to Recovery
                </h2>
                <div className="space-y-6 text-lg">
                  <p className="text-[#666666] leading-relaxed">
                    <span className="font-semibold text-[#333333]">
                      A combination of these five factors is usually the culprit in causing HA.
                    </span> However, understanding this is the first step toward healing.
                  </p>
                  <div className="bg-[#FFB4A2]/20 rounded-lg p-6 border border-[#FFB4A2]/30">
                    <p className="text-[#333333] font-bold text-xl mb-4">
                      🌟 Once recognized, mindset and habits can be changed to overcome these signals
                    </p>
                    <p className="text-[#FFB4A2] font-bold text-2xl">
                      Periods can be restored
                    </p>
                  </div>
                  <p className="text-[#666666]">
                    Recovery is a journey that requires patience, self-compassion, and often professional support. 
                    Every small step toward healing matters.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-[#333333] mb-8">
              Professional Support & Resources
            </h2>
            <Card className="border-[#C1A7E1]/20 shadow-lg">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-[#666666] text-lg leading-relaxed">
                    Recovery from HA often benefits from a multidisciplinary approach involving 
                    healthcare professionals who understand the complexities of this condition.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="bg-[#C1A7E1]/10 rounded-lg p-4">
                      <h3 className="font-semibold text-[#333333] mb-2">Healthcare Team</h3>
                      <ul className="text-[#666666] text-sm space-y-1">
                        <li>• Reproductive endocrinologist</li>
                        <li>• Registered dietitian</li>
                        <li>• Mental health counselor</li>
                        <li>• Primary care physician</li>
                      </ul>
                    </div>
                    <div className="bg-[#87C4BB]/10 rounded-lg p-4">
                      <h3 className="font-semibold text-[#333333] mb-2">Additional Resources</h3>
                      <ul className="text-[#666666] text-sm space-y-1">
                        <li>• Support groups</li>
                        <li>• Educational materials</li>
                        <li>• Recovery-focused apps</li>
                        <li>• Online communities</li>
                      </ul>
                    </div>
                  </div>
                  <Button 
                    className="bg-[#87C4BB] hover:bg-[#87C4BB]/90 text-white px-8 py-3 text-lg rounded-full"
                    onClick={() => window.location.href = '/bbt-tracker'}
                  >
                    Start Your Tracking Journey
                  </Button>
                  <p className="text-sm text-[#666666] mt-4">
                    Remember: You deserve support, healing, and hope. Recovery is possible.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
