
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-blue-100 dark:from-indigo-950 dark:to-blue-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-24 w-24">
            <motion.div 
              className={`absolute inset-0 rounded-full ${
                isDarkMode ? "bg-indigo-800/30" : "bg-indigo-200"
              }`}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
            
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <Loader2 className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
            </motion.div>
          </div>
          
          <div className="space-y-2">
            <motion.h2 
              className="text-2xl font-bold text-indigo-700 dark:text-indigo-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.h2>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
