import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import useMeasure from "react-use-measure";

/**
 * Thanks to Sam Selikoff for providing the template!
*/

const duration = 0.25
export default function ResizablePanel({ children }) {
    let [ref, { height }] = useMeasure();

    return (
        <motion.div
            animate={{ height: height || "auto" }}
            className="relative overflow-hidden"
            exit={{ height: 0 }}
        >
            <AnimatePresence initial={true}>
                <motion.div
                    key={JSON.stringify(children, ignoreCircularReferences())}
                    initial={{
                        opacity: 0.2,
                        // x: 100,
                    }}
                    animate={{
                        opacity: 1,
                        // x: 0,
                        transition: { duration: 0.25, delay: 0.1 },
                    }}
                    exit={{
                        opacity: 0,
                        // x: -100,
                        transition: { duration }
                    }}
                >
                    <div
                        ref={ref}
                        className={`${height ? "absolute" : "relative"} w-full `}
                    >
                        {children}
                    </div>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}

/*
  Replacer function to JSON.stringify that ignores
  circular references and internal React properties.
  https://github.com/facebook/react/issues/8669#issuecomment-531515508
*/
const ignoreCircularReferences = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (key.startsWith("_")) return; // Don't compare React's internal props.
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) return;
            seen.add(value);
        }
        return value;
    };
};