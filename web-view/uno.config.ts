import { defineConfig,presetAttributify,presetUno,presetWind } from 'unocss';
export default defineConfig({
    presets: [
        presetWind(),
        presetUno(),
        presetAttributify()
    ]
});