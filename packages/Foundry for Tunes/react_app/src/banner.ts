import { useEffect, useState } from "react";
import { BannerProps } from "./components/Banner";
import { createEmitter } from "./events";

type BannerPropsWithExtra = BannerProps & {
  precedence: number;
  onlyPublic?: boolean;
};

const saved: BannerPropsWithExtra[] = [];

const emitter = createEmitter<{ update: [] }>();

export const useBanner = (
  props: BannerPropsWithExtra | false | undefined | null
) => {
  useEffect(() => {
    if (!props) return;
    let i = 0;
    while (i < saved.length && props.precedence <= saved[i].precedence) i++;
    console.log(`Inserting new banner at index ${i}`, props, saved);
    saved.splice(i, 0, props);

    console.log("EMIT", emitter.emitter.all.get("update")?.length);
    emitter.emit("update");

    return () => {
      console.log(`Removing banner from index ${saved.indexOf(props)}`);
      saved.splice(saved.indexOf(props), 1);
      emitter.emit("update");
    };
  }, [props]);
};

export const useCurrentBanner = () => {
  const [banner, setBanner] = useState<BannerPropsWithExtra | undefined>(
    saved[0]
  );

  useEffect(() => {
    setBanner(saved[0]);
    return emitter.on("update", () => setBanner(saved[0]));
  }, []);

  return banner;
};
