import React from 'react';
import { motion } from 'framer-motion';
import { fadeUpVariants } from '../../utils/motion'; // 引入剛剛建立的共用動畫

const SectionTitle = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <motion.h2 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUpVariants}
      className="text-3xl md:text-4xl font-bold mb-4 text-slate-900"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
        className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"
      ></motion.div>
    )}
  </div>
);

export default SectionTitle;