"use client"

import ReferralForm from "@/components/form/referral";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import styles from "./main.module.css";
import AnimatedArrowButton from "@/components/ui/buttons/animated-arrow";
import plusIcon from "@/assets/icons/plus.svg"
import Image from "next/image";

export default function AddReferralModal({ className = "rounded-full", iconClass = "rounded-full" }) {
  const renderPlusIcon = () => <Image src={plusIcon} alt="add post" />
  return (
    <Dialog>
      <DialogTrigger asChild className={styles.triggerBtnPos}>
        <AnimatedArrowButton text="Add Post" renderIcon={renderPlusIcon} className={className} iconClass={iconClass} />
      </DialogTrigger>
      <DialogContent
        className={styles.dialogContent}
        overlayClassName={styles.dialogOverlay}
      >
        <DialogHeader>
          <DialogTitle className={styles.dialogTitle}>
            Post New Referral
          </DialogTitle>
        </DialogHeader>
        <ReferralForm />
      </DialogContent>
    </Dialog>
  );
}
