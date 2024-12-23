import { useRef, useState } from "react";
import { Modal } from "../components/Modal";
import { FeedbackSection } from "./FeedbackSection";

export interface FeedbackProps {
  onExit: () => void;
}

export const FeedbackModal = ({ onExit }: FeedbackProps) => {
  const [loading, setLoading] = useState(false);

  // This parent state is just to run a confirm prompt to ensure users don't lose state
  const feedback = useRef("");
  const files = useRef<Array<{ file: File; url: string }>>([]);

  return (
    <Modal
      titleText="Add To Playlist"
      onExit={() => {
        if (files.current.length > 0 || feedback.current) {
          const result = confirm(
            "Are you sure you want to close the feedback modal? You will lose your feedback."
          );

          if (!result) return;
        }

        onExit();
      }}
      className="max-w-full"
      style={{ width: "30rem" }}
      loading={loading}
    >
      <FeedbackSection
        setLoading={setLoading}
        feedbackRef={feedback}
        filesRef={files}
      />
    </Modal>
  );
};
