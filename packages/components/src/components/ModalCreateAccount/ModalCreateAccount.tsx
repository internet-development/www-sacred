"use client";

import styles from "./ModalCreateAccount.module.scss";

import { useModals } from "@srcl/ui/hooks";

import { Button } from "@srcl/ui/components/Button";
import { CardDouble } from "@srcl/ui/components/CardDouble";

import { Checkbox } from "@srcl/ui/components/Checkbox";
import { Input } from "@srcl/ui/components/Input";
import { RadioButtonGroup } from "@srcl/ui/components/RadioButton/RadioButtonGroup";

export const ModalCreateAccount = () => {
  const { close } = useModals();

  return (
    <div className={styles.root}>
      <CardDouble title="NEW ACCOUNT">
        Create a new MakeBelieve™ account, where anything is possible at your
        command line in the browser.
        <br />
        <br />
        <RadioButtonGroup
          defaultValue="modal_developer"
          options={[
            {
              value: "modal_individual",
              label: "I’m using this for personal use.",
            },
            {
              value: "modal_developer",
              label: "I’m building or creating something for work.",
            },
            {
              value: "modal_company",
              label: "We’re using this as a team or organization.",
            },
          ]}
        />
        <br />
        <Input
          autoComplete="off"
          label="USERNAME"
          placeholder="Choose a username (e.g., SurfGirl29)"
          name="modal_username"
        />
        <Input
          autoComplete="off"
          label="PASSWORD"
          placeholder="Create a password (8+ characters)"
          type="password"
          name="modal_password"
        />
        <Input
          autoComplete="off"
          label="CONFIRM"
          placeholder="Type it again"
          type="password"
          name="modal_confirm"
        />
        <br />
        <Checkbox name="modal_terms">
          I agree to the Terms of Service, Data Privacy Policy, and Acceptable
          Use Guidelines.
        </Checkbox>
        <Checkbox name="modal_goodwill">
          I agree not to use this service for unlawful purposes.
        </Checkbox>
        <br />
        <Button onClick={() => close()}>Create an account</Button>
      </CardDouble>
    </div>
  );
};
