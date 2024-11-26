import ReferralForm from "@/components/form/referral";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import styles from "./main.module.css";

export default function AddReferralModal() {
  return (
    <Dialog>
      <DialogTrigger asChild className={styles.triggerBtnPos}>
        <button className={styles.triggerBtn}>+</button>
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
        <DialogFooter className={styles.dialogFooter}>
          <button
            type="submit"
            form="post-referral"
            className={styles.formSubmitBtn}
          >
            Post
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
