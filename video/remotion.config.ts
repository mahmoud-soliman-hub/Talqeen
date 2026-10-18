import { Config } from '@remotion/cli/config';

Config.setEntryPoint('src/index.ts');
if (process.env.REMOTION_CHROME) Config.setBrowserExecutable(process.env.REMOTION_CHROME);
