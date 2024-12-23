import { registerValuePlugin } from "@thebigrick/catalyst-pluginizr";
import {Config} from "payload";
import {Media} from "./collections/Media";

registerValuePlugin<Config>({
    name: "PayloadCMSConfig",
    resourceId: "@thebigrick/catalyst-payloadcms/payload.raw.config",
    wrap: (config) => ({
        ...config,
        collections: [
            Media
        ]
    })
});
