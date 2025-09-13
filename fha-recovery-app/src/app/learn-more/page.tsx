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

      {/* Basics of HA Section */}
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
                  What is Hypothalamic Amenorrhea?
                </h2>
                <div className="space-y-4 text-lg text-[#666666] leading-relaxed">
                  <p>
                    Hypothalamic Amenorrhea (HA) occurs when your brain's hypothalamus - the control center 
                    for hormones - stops sending the signals needed to maintain your menstrual cycle. This 
                    results in missing periods for three months or more.
                  </p>
                  <p>
                    HA is a component of the female athlete triad and relative energy deficiency in sport (RED-S), 
                    affecting not just athletes but anyone experiencing energy imbalance.
                  </p>
                  <div className="bg-[#87C4BB]/10 rounded-lg p-6 border border-[#87C4BB]/20">
                    <p className="text-[#87C4BB] font-semibold text-xl mb-2">
                      ✨ The Hope-Filled Truth
                    </p>
                    <p className="text-[#333333] font-medium">
                      HA is reversible in most cases. With the right approach, understanding, and support, 
                      your body can restore its natural hormonal balance and menstrual cycle.
                    </p>
                  </div>
                  <p>
                    Understanding HA starts with recognizing that it's your body's protective response - 
                    not a failure, but a signal that needs attention and care.
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

      {/* Symptoms Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#C1A7E1]/10 to-[#FFB4A2]/10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#333333] mb-6">
              Recognizing the Symptoms
            </h2>
            <p className="text-xl text-[#666666] max-w-3xl mx-auto leading-relaxed">
              HA affects more than just your menstrual cycle. Understanding these symptoms can help you 
              recognize when your body needs support and care.
            </p>
          </motion.div>
          
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              "Loss of menstrual periods (3+ months)",
              "Chronic fatigue and low energy",
              "Hair loss or thinning",
              "Decreased bone density",
              "Cold intolerance",
              "Sleep disturbances",
              "Mood changes and irritability",
              "Loss of libido",
              "Digestive issues",
              "Frequent injuries or slow healing",
              "Brain fog and difficulty concentrating",
              "Anxiety or depression"
            ].map((symptom, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-lg p-4 shadow-md border border-[#C1A7E1]/20 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#FFB4A2] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-[#333333] font-medium leading-relaxed">{symptom}</p>
                </div>
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
            <div className="bg-[#C1A7E1]/20 rounded-lg p-6 max-w-3xl mx-auto border border-[#C1A7E1]/30">
              <p className="text-[#333333] font-medium text-lg">
                💜 <strong>Remember:</strong> These symptoms are your body's way of communicating. 
                They're not permanent, and with proper care and support, they can improve as your body heals.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How Our Product Helps Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#87C4BB]/20 to-[#FFB4A2]/20">
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
                  How Harmonia Supports Your Recovery
                </h2>
                <div className="space-y-6 text-lg">
                  <p className="text-[#666666] leading-relaxed">
                    <span className="font-semibold text-[#333333]">
                      Understanding HA is just the beginning.
                    </span> Harmonia provides the tools and support you need to navigate your recovery journey with confidence and compassion.
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
                      Harmonia combines evidence-based tracking with compassionate support, 
                      creating a safe space where healing can happen naturally.
                    </p>
                  </div>
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
