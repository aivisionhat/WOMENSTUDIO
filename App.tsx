
import React, { useState, useCallback, useEffect, useRef } from 'react';
import ImageUploader from './components/ImageUploader';
import GeneratedImage from './components/GeneratedImage';
import { generatePortrait } from './services/geminiService';
import HistoryPanel from './components/HistoryPanel';
import BottomBar from './components/BottomBar';
import * as db from './services/dbService';
import { fileToDataURL, dataURLtoFile } from './utils/fileUtils';


const midAutumnPrompt = `Use the uploaded face photo and keep the face 100% consistent with the original upload. Generate a full-length fashion photograph showing the entire body from head to toe, with feet visible, of the same person, direct gaze at the camera. 

Pose: (Sitting on bamboo mat/Standing holding a lantern, leaning slightly, eyes looking into the distance/Holding a tray of moon cakes, smiling brightly/Hand gently stroking hair/Gently lifting the ao dai with a shy expression/Holding a bright star lantern and gently moving it forward/Holding a moon cake, eyes smiling at camera/High-fashion pose: standing sideways with light shining from behind and a cold face). 

wearing (Traditional Vietnamese Ao Dai or modernized Ao Dai: (Material: silk/brocade/voile), Color: (white/red/yellow/pastel pink/turquoise/purple))/(Ao yem – skirt (traditional costume): (Can wear a thin veil or not))/(Costume: Sister Hang: white ao dai or silk dress (white/pink), (with flower or small crown))

Hairstyle: (Crown Braid/Halo Braid/Braided updo/Loose waves/Side braid/Long braid) with delicate earrings (small round pearl stud/long pearl earring/gold slim earring/silver slim earring/Gemstone earring/Crystal earring) and 
a necklace (white pearl necklace/pink pearl necklace/black pearl necklace/Single fiber necklace/Multi-layered style necklace/slim gold necklace/gold small pendant). 
Footwear: (Wooden clogs/High heel sandals with thin straps/Pointed high heels). 

Background: 
(A Lantern Street decorated with glowing red and yellow lanterns and blooming pink peach blossoms with a soft bokeh effect)/
(A bamboo wall decorated with glowing red and yellow lanterns with a soft bokeh effect)/
(A Mid-Autumn Festival night street with a soft bokeh effect)/
(A background with traditional Vietnamese drawings and glowing lanterns)/
(A dark background with bright moonlight)/
(Legendary – fairy tale setting: “full moon and lotus pond”). 

Soft warm cinematic lighting, ultra-detailed, realistic skin texture, smooth silk fabric with natural shine, high-fashion studio photography aesthetic, 8K resolution, depth of field, sharp focus.`;

const midAutumnHalfBodyPrompt = `Use the uploaded face photo and keep the face 100% consistent with the original upload. Generate a half-body portrait from the waist up of the same person, direct gaze at the camera. 

Pose: (Sitting on bamboo mat/Standing holding a lantern, leaning slightly, eyes looking into the distance/Holding a tray of moon cakes, smiling brightly/Hand gently stroking hair/Gently lifting the ao dai with a shy expression/Holding a bright star lantern and gently moving it forward/Holding a moon cake, eyes smiling at camera/High-fashion pose: standing sideways with light shining from behind and a cold face). 

wearing (Traditional Vietnamese Ao Dai or modernized Ao Dai: (Material: silk/brocade/voile), Color: (white/red/yellow/pastel pink/turquoise/purple))/(Ao yem – skirt (traditional costume): (Can wear a thin veil or not))/(Costume: Sister Hang: white ao dai or silk dress (white/pink), (with flower or small crown)).

Hairstyle: (Crown Braid/Halo Braid/Braided updo/Loose waves/Side braid/Long braid) with delicate earrings (small round pearl stud/long pearl earring/gold slim earring/silver slim earring/Gemstone earring/Crystal earring) and a necklace (white pearl necklace/pink pearl necklace/black pearl necklace/Single fiber necklace/Multi-layered style necklace/slim gold necklace/gold small pendant). 

Background: 
(A Lantern Street decorated with glowing red and yellow lanterns and blooming pink peach blossoms with a soft bokeh effect)/
(A bamboo wall decorated with glowing red and yellow lanterns with a soft bokeh effect)/
(A Village temple decorated with glowing lanterns with a soft bokeh effect)/
(A Mid-Autumn Festival night street with a soft bokeh effect)/
(A background with traditional Vietnamese drawings and glowing lanterns)/
(A dark background with bright moonlight)/
(Legendary – fairy tale setting: “full moon and lotus pond”).

Soft warm cinematic lighting, ultra-detailed, realistic skin texture, smooth silk fabric with natural shine, high-fashion studio photography aesthetic, 8K resolution, depth of field, sharp focus.`;

const midAutumnCloseUpPrompt = `Use the uploaded face photo and keep the face 100% consistent with the original upload. Generate a close-up headshot portrait from the shoulders up of the same person, direct gaze at the camera. 

Pose: (Direct gaze at camera, smiling brightly/Hand gently stroking hair, shy expression/Eyes smiling at camera/High-fashion pose with a cold face). 

wearing (Traditional Vietnamese Ao Dai or modernized Ao Dai: (Material: silk/brocade/voile), Color: (white/red/yellow/pastel pink/turquoise/purple))/(Ao yem – skirt (traditional costume): (Can wear a thin veil or not))/(Costume: Sister Hang: white ao dai or silk dress (white/pink), (with flower or small crown)).

Hairstyle: (Crown Braid/Halo Braid/Braided updo/Loose waves/Side braid/Long braid) with delicate earrings (small round pearl stud/long pearl earring/gold slim earring/silver slim earring/Gemstone earring/Crystal earring) and a necklace (white pearl necklace/pink pearl necklace/black pearl necklace/Single fiber necklace/Multi-layered style necklace/slim gold necklace/gold small pendant). 

Background: 
(A background of lanterns with a soft bokeh effect)/
(A bamboo wall background)/
(A background of traditional Vietnamese drawings)/
(A dark background with bright moonlight)/
(Legendary – fairy tale setting: “full moon and lotus pond”).

Soft warm cinematic lighting, ultra-detailed, realistic skin texture, smooth silk fabric with natural shine, high-fashion studio photography aesthetic, 8K resolution, depth of field, sharp focus.`;

const fairyBeautyStaticPrompt = `Use the uploaded face photo and keep the face consistent 100% to the original photo (no exceptions). Create a full body fashion photo, showing the entire body from head to toe, with feet visible, of the same person, looking straight at the camera.

Outfit: ((Traditional Chinese fairy gown)/(Ancient immortal goddess dress (chinese))/(a pure white gown with long wide sleeves and sheer silk layers, accented by a blue ribbon belt and fluttering silk ribbons. Her hair is styled in an elegant bun adorned with delicate hair ornaments. Pink cherry blossom petals float around her, creating a dreamy, ethereal atmosphere. )/(A sash in warm orange and teal ties elegantly at her waist. Her black hair is styled in an elaborate updo adorned with delicate floral hair ornaments. Warm golden light from a lantern in her hand softly illuminates her face, contrasting with the cool silver moonlight.Red flower petals float gently around her, creating a romantic and ethereal atmosphere. Her hand gracefully holding the lantern, the other resting near her waist))

Pose & background: 
(((standing (keep the face consistent 100%) elegantly/fairy pose) and hold (a white cute rabbit/a vietnamese paper fan) in front of a majestic crescent moon, surrounded by sparkling stars and delicate clouds in the smooth night sky, the water surface, She stands on a calm lake reflecting the floating pink lotus flowers.
A huge crescent moon shines brightly behind her, illuminating the scene with a soft halo. The night sky is full of sparkling stars and floating blue clouds. ((optional) The dark mystical rocks in the distance create depth). The water reflects the moonlight and her figure, creating a dreamy surreal atmosphere) 
/ 
(standing (keep the face consistent 100%) gracefully on soft clouds under a bright full moon night sky. She ((holds a glowing (star/rabbit/fish/cat/dog/wind) lantern in one hand, casting a warm golden light on her face, while the other hand is raised gracefully) / (holds a (white/yellow) rabbit))))

((Cinematic lighting, super detailed, realistic skin textures, smooth silk fabrics with natural shine, high-end fashion studio photography aesthetic, 8K resolution, depth of field, sharp focus)/
(soft clouds under a bright full moon night sky.
Soft moonlight and gentle blue tones illuminate the scene, with cinematic lighting, ultra-detailed textures, fantasy fairytale aesthetic, 8K ultra high resolution))`;


const femaleCEOFullBodyPrompt = `Use the uploaded face photo and keep the face 100% consistent with the original upload. Generate a full-body portrait from head to toe of the same person standing with an elegant pose, direct gaze at the camera. 
Outfit: (A fitted black blazer with a white silk shirt and black trousers/An oversized white blazer dress/A navy blue full suit with a satin shirt/A grey pencil skirt with a light pastel shirt and matching blazer/A knee-length bodycon dress in a solid color like black or burgundy/A full ton-sur-ton suit). 
Accessories: Pointed-toe high heels in (black/nude/burgundy). A luxury watch is required. Delicate luxury earrings are required. Optional accessories: (a high-end handbag/large sunglasses/a luxury necklace). 
Hair: (lob hairstyle/shoulder-length straight hair/Low bun/Chignon/Wavy hair) with hair color (black/dark brown/cool brown). 
Background: (Modern meeting room with a city view/High-rise office in front of a large desk with a city skyline at night/Luxury company lobby with marble floor and spotlights/City skyline view from a high floor/Skyscraper glass office reflecting urban lights/On stone stairs of classical European architecture/Standing next to a luxury car/Standing next to a private plane/5-star hotel lobby with crystal chandeliers/Dark studio with spotlight on the character/Black or white marble background). 
Soft warm cinematic lighting, ultra-detailed, realistic skin texture, high-fashion studio photography aesthetic, 8K resolution, depth of field, sharp focus.`;

const femaleCEOHalfBodyPrompt = `Use the uploaded face photo and keep the face 100% consistent with the original upload. Generate a half-body portrait from the waist up of the same person standing with an elegant pose, direct gaze at the camera. 
Outfit: (A fitted black blazer with a white silk shirt/An oversized white blazer/A navy blue suit jacket over a satin shirt/A blazer dress). 
Accessories: A luxury watch is required. Delicate luxury earrings are required. Optional accessories: (a luxury necklace/large sunglasses). 
Hair: (lob hairstyle/shoulder-length straight hair/Low bun/Chignon/Wavy hair) with hair color (black/dark brown/cool brown). 
Background: (Modern meeting room with a city view/High-rise office in front of a large desk with a city skyline at night/Luxury company lobby with marble floor and spotlights/City skyline view from a high floor/Skyscraper glass office reflecting urban lights/On stone stairs of classical European architecture/Dark studio with spotlight on the character/Black or white marble background). 
Soft warm cinematic lighting, ultra-detailed, realistic skin texture, high-fashion studio photography aesthetic, 8K resolution, depth of field, sharp focus.`;

const femaleCEOCloseUpPrompt = `Use the uploaded face photo and keep the face 100% consistent with the original upload. Generate a close-up headshot portrait from the shoulders up of the same person with an elegant pose, direct gaze at the camera. The collar of a (blazer/silk shirt) should be visible. 
Accessories: Delicate luxury earrings are required. Optional accessory: (a luxury necklace/large sunglasses). 
Hair: (lob hairstyle/shoulder-length straight hair/Low bun/Chignon/Wavy hair) with hair color (black/dark brown/cool brown). 
Background: (Blurred modern office background/Blurred city skyline at night/Dark studio background/Marble background). 
Soft warm cinematic lighting, ultra-detailed, realistic skin texture, high-fashion studio photography aesthetic, 8K resolution, depth of field, sharp focus.`;

const photoRestorationPrompt = `{
"version": "1.0",
"task": "image_edit",
"caption": "Phục chế & nâng cấp ảnh cũ – giữ background gốc, màu điện ảnh, chuẩn Phase One XF IQ4 150MP",
"notes": "Biến ảnh cũ (kể cả ảnh chụp lại) thành ảnh màu hiện đại, sạch tuyệt đối, giữ background gốc nhưng nâng cấp đẳng cấp như chụp mới. Ưu tiên bảo toàn danh tính và pose.",
"input_image": "REPLACE_WITH_IMAGE_ID_OR_PATH",
"preprocess": {
"detect_and_isolate_original_photo": true,
"auto_crop_photo_edges": true,
"clean_edges": true,
"remove_hands_or_objects": true,
"perspective_correction": true,
"flatten_page_curvature": true,
"glare_reduction": "strict",
"reflection_removal": "strict",
"specular_highlight_fix": true
},
"camera_emulation": {
"brand_model": "Phase One XF IQ4 150MP",
"lens": "Schneider Kreuznach 80mm LS f/2.8",
"medium_format": true,
"look": "ultimate sharpness, maximum dynamic range, medium format 3D pop, cinematic rendering"
},
"composition": {
"framing": "three-quarter body (from mid-thigh up)",
"orientation": "portrait",
"crop_policy": "do_not_crop_face_or_hands",
"keep_pose": true,
"zoom": "slight zoom-out for wider context"
},
"subject_constraints": {
"keep_identity": true,
"lock_features": ["eyes","nose","lips","eyebrows","jawline","face_shape","ears","hairline"],
"expression_policy": "preserve_original"
},
"retouching": {
"skin": {
"tone": "realistic warm neutral",
"finish": "radiant but detailed",
"texture": "retain fine pores; avoid plastic look",
"blemishes": "remove completely",
"luminosity_balance": "uniform subtle glow",
"color_uniformity": "fix uneven tones"
},
"hair": { "finish": "clean, neat, natural gloss", "flyaways": "reduce but keep natural strands" },
"eyes": {
"iris_color": "natural brown/gray",
"whites_desaturation": 0.1,
"iris_clarity": 0.2,
"avoid_overwhitening": true,
"avoid_exaggeration": true
},
"teeth": { "natural_whiten": 0.08, "avoid_pure_white": true },
"clothing": {
"fabric_look": "premium, fine weave, crisp edges",
"wrinkle_reduction": "moderate",
"texture_enhancement": 0.25
},
"repair_cracks": "strict",
"remove_dust_scratches": "strict",
"remove_stains": "strict",
"remove_folds": true,
"restore_faded_details": true
},
"colorization": {
"apply_to": "entire_photo",
"style": "cinematic, natural, true-to-life",
"skin_tone_accuracy": "very_high",
"background_colorization": "full, layered, realistic",
"clothing_colorization": "faithful but premium",
"avoid_exaggeration": true
},
"background": {
"policy": "preserve_and_enhance",
"keep_original": true,
"enhancement": {
"colorize": "natural, true-to-life, cinematic color grading",
"restore_damage": true,
"texture_cleanup": "remove paper grain and speckles completely",
"add_depth": "studio gradient with layered tones and soft atmospheric haze",
"contrast_boost": "medium-high with soft roll-off",
"dynamic_range": "expanded like medium format",
"lighting_match": true
},
"remove_external_objects": true,
"banding_fix_on_background": true
},
"color_tone": {
"overall": "natural, true-to-life",
"saturation": "balanced vivid",
"contrast": "medium with cinematic roll-off",
"vibrance": 0.2,
"color_restoration": "revive faded colors, unify uneven tones, remove discoloration completely",
"auto_tone_balance": "strict",
"auto_contrast_balance": true,
"recolorize_consistently": true
},
"detail_sharpness": {
"method": "edge-aware sharpening",
"amount": 0.4,
"radius": 0.9,
"threshold": 0.02,
"noise_reduction": { "luminance": 0.22, "chroma": 0.26, "preserve_details": 0.85 }
},
"clean_up": {
"remove_noise": true,
"remove_artifacts": true,
"remove_scratches": "strict",
"remove_dust": "strict",
"remove_stains": "strict",
"remove_folds": true,
"deblotching": true,
"desilvering_fix": true,
"paper_texture_reduction": "strong",
"restore_faded_colors": true,
"reconstruct_missing_parts": "museum-grade",
"reconstruct_missing_corners": true,
"hallucination_control": "only realistic restoration, no fantasy",
"heritage_preservation_strict": true,
"archival_quality": "museum-grade restoration, pristine finish",
"final_finish": "as new color studio photograph, indistinguishable from modern digital capture"
},
"controls": {
"face_identity_lock": 0.96,
"pose_lock": 0.95,
"background_enhancement_strength": 0.9,
"colorization_strength": 0.9,
"restoration_strength": 0.95,
"background_replace_strength": 0.0
},
"output": {
"resolution": "12000x8000",
"dpi": 600,
"format": "TIFF",
"color_space": "AdobeRGB 1998",
"bit_depth": "16-bit",
"background_alpha": "opaque"
},
"safety_bounds": {
"do_not": [
"change face geometry or identity",
"change pose",
"alter clothing style drastically",
"add heavy makeup",
"over-smooth or plastic skin",
"over-sharpen halos",
"exaggerated eye colors"
],
"negative_prompt": [
"paper grain",
"speckles",
"flat monochrome background",
"hands holding photo",
"photo edges visible",
"glare spots",
"crooked perspective",
"color casts",
"posterization/banding",
"muddy blacks",
"oversaturated skin",
"cartoonish colors",
"loss of fine texture",
"visible damage marks"
]
},
"seed": 142857,
"metadata": {
"locale": "vi-VN",
"creator": "fine art restoration specialist",
"purpose": "phục chế & nâng cấp toàn ảnh lên chuẩn studio hiện đại, giữ nền gốc nhưng nâng cấp màu/độ sâu/dải sáng",
"workflow": "studio emulation, medium format rendering, heritage restoration, cinematic color grading"
}
}`;

type ImageStyle = 'midAutumn' | 'femaleCEO' | 'photoRestoration' | 'fairyBeauty';

export type HistoryItem = {
  id?: number;
  url: string;
  prompt: string;
  style: ImageStyle | null;
  originalImageUrl: string;
};

type BasePromptKey = 
  | 'midAutumnPrompt' 
  | 'midAutumnHalfBodyPrompt' 
  | 'midAutumnCloseUpPrompt'
  | 'fairyBeautyStaticPrompt'
  | 'femaleCEOFullBodyPrompt'
  | 'femaleCEOHalfBodyPrompt'
  | 'femaleCEOCloseUpPrompt'
  | 'photoRestorationPrompt'
  | null;

const promptMap: Record<NonNullable<BasePromptKey>, string> = {
    midAutumnPrompt,
    midAutumnHalfBodyPrompt,
    midAutumnCloseUpPrompt,
    fairyBeautyStaticPrompt,
    femaleCEOFullBodyPrompt,
    femaleCEOHalfBodyPrompt,
    femaleCEOCloseUpPrompt,
    photoRestorationPrompt
};

const processRandomPrompt = (prompt: string): string => {
  const regex = /\(([^()]*\/[^()]*)\)/g;

  const replacer = (match: string): string => {
    const optionsString = match.substring(1, match.length - 1);
    const options = optionsString.split('/');
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex]?.trim() ?? '';
  };
  
  let processedPrompt = prompt;
  // Loop to handle nested random options
  while (processedPrompt.match(regex)) {
      processedPrompt = processedPrompt.replace(regex, replacer);
  }
  return processedPrompt;
};

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedHistory, setGeneratedHistory] = useState<HistoryItem[]>([]);
  const [isDbLoading, setIsDbLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [activeStyle, setActiveStyle] = useState<ImageStyle | null>(null);
  const [loadingStyle, setLoadingStyle] = useState<ImageStyle | null>(null);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<number | null>(null);
  const [showQuickEdit, setShowQuickEdit] = useState<boolean>(false);
  const [quickEditPrompt, setQuickEditPrompt] = useState<string>('');
  
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [currentStyle, setCurrentStyle] = useState<ImageStyle | null>(null);
  const [currentOriginalImageUrl, setCurrentOriginalImageUrl] = useState<string | null>(null);
  const [currentBasePromptKey, setCurrentBasePromptKey] = useState<BasePromptKey>(null);
  

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  useEffect(() => {
    const loadHistory = async () => {
      setIsDbLoading(true);
      try {
        const history = await db.getAllImages();
        setGeneratedHistory(history);
      } catch (error) {
        console.error("Failed to load history from DB:", error);
        setError("Could not load image gallery.");
      } finally {
        setIsDbLoading(false);
      }
    };
    loadHistory();
  }, []);

  const addHistoryItem = useCallback(async (item: HistoryItem) => {
    try {
      const newItem = await db.addImage(item);
      setGeneratedHistory(prevHistory => [newItem, ...prevHistory]);
    } catch (error) {
       console.error("Failed to save history item to DB:", error);
    }
  }, []);

  const deleteHistoryItem = useCallback(async (idToDelete: number) => {
    try {
      await db.deleteImage(idToDelete);
      setGeneratedHistory(prevHistory => 
        prevHistory.filter((item) => item.id !== idToDelete)
      );
    } catch (error) {
       console.error("Failed to delete history item from DB:", error);
    }
  }, []);


  const handleThemeToggle = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLanguageToggle = () => {
    setLanguage(prev => prev === 'vi' ? 'en' : 'vi');
  };

  const handleImageUpload = async (file: File) => {
    setImageFile(file);
    setGeneratedUrl(null);
    setError(null);
    const dataUrl = await fileToDataURL(file);
    setPreviewUrl(dataUrl);
  };

  const handleGenerateClick = useCallback(async (prompt: string, style: ImageStyle | null, basePromptKey: BasePromptKey = null) => {
    if (!imageFile || !previewUrl) {
      setError(language === 'vi' ? "Vui lòng tải ảnh lên trước." : "Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setLoadingStyle(style);
    setGeneratedUrl(null);
    setError(null);
    setProgress(0);

    if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
    }
    
    progressIntervalRef.current = window.setInterval(() => {
        setProgress(prev => {
            const newProgress = Math.min(prev + Math.random() * 3, 95);
            if (newProgress >= 95 && progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
            return newProgress;
        });
    }, 250);

    try {
      const resultUrl = await generatePortrait(imageFile, prompt);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setProgress(100);
      
      const newHistoryItem: HistoryItem = { url: resultUrl, prompt, style, originalImageUrl: previewUrl };
      setGeneratedUrl(resultUrl);
      setCurrentPrompt(prompt);
      setCurrentStyle(style);
      setCurrentOriginalImageUrl(previewUrl);
      setCurrentBasePromptKey(basePromptKey);
      await addHistoryItem(newHistoryItem);
      
      setTimeout(() => {
          setIsLoading(false);
          setLoadingStyle(null);
          setActiveStyle(null);
          setProgress(0);
      }, 500);
    } catch (err) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Generation failed: ${errorMessage}`);
      console.error(err);
      
      setIsLoading(false);
      setLoadingStyle(null);
      setActiveStyle(null);
      setProgress(0);
    } 
  }, [imageFile, previewUrl, language, addHistoryItem]);
  
  const handleQuickEditSubmit = useCallback(async () => {
    if (!quickEditPrompt || !generatedUrl) {
      setError(language === 'vi' ? "Vui lòng nhập mô tả và có ảnh để chỉnh sửa." : "Please enter a prompt and have an image to edit.");
      return;
    }
    if (!currentOriginalImageUrl) {
      setError(language === 'vi' ? "Không tìm thấy ảnh gốc để lưu." : "Original image not found for saving.");
      return;
    }

    setIsLoading(true);
    setLoadingStyle(null);
    setError(null);
    setProgress(0);
    setShowQuickEdit(false);

    if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
    }
    
    progressIntervalRef.current = window.setInterval(() => {
        setProgress(prev => {
            const newProgress = Math.min(prev + Math.random() * 3, 95);
            if (newProgress >= 95 && progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
            return newProgress;
        });
    }, 250);

    try {
      const response = await fetch(generatedUrl);
      const blob = await response.blob();
      const file = new File([blob], "image-to-edit.png", { type: blob.type });

      const resultUrl = await generatePortrait(file, quickEditPrompt);

      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setProgress(100);

      const newHistoryItem: HistoryItem = { url: resultUrl, prompt: quickEditPrompt, style: null, originalImageUrl: currentOriginalImageUrl };
      setGeneratedUrl(resultUrl);
      setCurrentPrompt(quickEditPrompt);
      setCurrentStyle(null);
      setCurrentBasePromptKey(null); // Clear base prompt for quick edits
      // currentOriginalImageUrl remains the same
      await addHistoryItem(newHistoryItem);
      setQuickEditPrompt('');
      
      setTimeout(() => {
          setIsLoading(false);
          setLoadingStyle(null);
          setProgress(0);
      }, 500);
    } catch (err) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Edit failed: ${errorMessage}`);
      console.error(err);
      
      setIsLoading(false);
      setLoadingStyle(null);
      setProgress(0);
    } 
  }, [generatedUrl, quickEditPrompt, currentOriginalImageUrl, language, addHistoryItem]);

  const handleHistorySelect = (item: HistoryItem) => {
    setGeneratedUrl(item.url);
    setCurrentPrompt(item.prompt);
    setCurrentStyle(item.style);
    setCurrentBasePromptKey(null); // Re-roll from history is not supported yet
    
    // Restore original face
    setPreviewUrl(item.originalImageUrl);
    setCurrentOriginalImageUrl(item.originalImageUrl);
    const restoredFile = dataURLtoFile(item.originalImageUrl, `restored-face-${Date.now()}.png`);
    setImageFile(restoredFile);
  };
  
  const handleStyleButtonClick = (style: ImageStyle) => {
    if (!imageFile) {
      setError(language === 'vi' ? "Vui lòng tải ảnh lên trước." : "Please upload an image first.");
      return;
    }

    if (style === 'photoRestoration') {
        const promptToUse = photoRestorationPrompt;
        handleGenerateClick(promptToUse, style, 'photoRestorationPrompt');
    } else if (style === 'fairyBeauty') {
        const promptToUse = processRandomPrompt(fairyBeautyStaticPrompt);
        handleGenerateClick(promptToUse, 'fairyBeauty', 'fairyBeautyStaticPrompt');
    } else {
        setActiveStyle(style);
        setShowConfirmation(true);
    }
  };

  const handleConfirmation = (type: 'full' | 'half' | 'close-up') => {
    if (!activeStyle) return;

    let basePrompt: string;
    let basePromptKey: BasePromptKey = null;

    if (activeStyle === 'midAutumn') {
      switch (type) {
        case 'full': basePrompt = midAutumnPrompt; basePromptKey = 'midAutumnPrompt'; break;
        case 'half': basePrompt = midAutumnHalfBodyPrompt; basePromptKey = 'midAutumnHalfBodyPrompt'; break;
        case 'close-up': basePrompt = midAutumnCloseUpPrompt; basePromptKey = 'midAutumnCloseUpPrompt'; break;
        default: return;
      }
    } else if (activeStyle === 'femaleCEO') {
      switch (type) {
        case 'full': basePrompt = femaleCEOFullBodyPrompt; basePromptKey = 'femaleCEOFullBodyPrompt'; break;
        case 'half': basePrompt = femaleCEOHalfBodyPrompt; basePromptKey = 'femaleCEOHalfBodyPrompt'; break;
        case 'close-up': basePrompt = femaleCEOCloseUpPrompt; basePromptKey = 'femaleCEOCloseUpPrompt'; break;
        default: return;
      }
    } else {
        return;
    }

    const promptToUse = processRandomPrompt(basePrompt);
    setShowConfirmation(false);
    handleGenerateClick(promptToUse, activeStyle, basePromptKey);
  };
  
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setActiveStyle(null);
  }

  const handleDuplicateClick = useCallback(() => {
      if (!imageFile) {
        setError(language === 'vi' ? "Vui lòng tải ảnh gốc lên." : "Please upload the original photo.");
        return;
      }

      // Priority 1: Re-roll from base prompt key if available.
      if (currentBasePromptKey) {
          const basePrompt = promptMap[currentBasePromptKey];
          const isRandomStyle = currentBasePromptKey !== 'photoRestorationPrompt';
          const promptToUse = isRandomStyle ? processRandomPrompt(basePrompt) : basePrompt;
          handleGenerateClick(promptToUse, currentStyle, currentBasePromptKey);
          return;
      }

      // Priority 2: Fallback for items from history or other cases.
      if (currentStyle === null) {
          setError(language === 'vi' ? "Không thể nhân bản ảnh đã qua chỉnh sửa nhanh." : "Cannot duplicate a quick-edited image.");
          return;
      }
      if (currentPrompt) {
          handleGenerateClick(currentPrompt, currentStyle, null);
          return;
      }
      
      setError(language === 'vi' ? "Không có thông tin để nhân bản." : "No information to duplicate.");
  }, [imageFile, currentPrompt, currentStyle, currentBasePromptKey, language, handleGenerateClick]);

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadClick = () => {
    if (generatedUrl) {
      downloadFile(generatedUrl, `women-studio-${Date.now()}.png`);
    }
  };

  const handleShare = async (url: string) => {
    if (!navigator.share) {
        alert(language === 'vi' ? 'Trình duyệt của bạn không hỗ trợ chức năng chia sẻ.' : 'Your browser does not support the share feature.');
        return;
    }

    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], `women-studio-${Date.now()}.png`, { type: blob.type });

        await navigator.share({
            title: 'WOMEN STUDIO Image',
            text: language === 'vi' ? 'Hãy xem bức ảnh tuyệt vời tôi đã tạo bằng WOMEN STUDIO!' : 'Check out this amazing image I created with WOMEN STUDIO!',
            files: [file],
        });
    } catch (error) {
        console.error('Error sharing:', error);
        if ((error as DOMException).name !== 'AbortError') {
             alert(language === 'vi' ? 'Không thể chia sẻ hình ảnh.' : 'Could not share the image.');
        }
    }
  };

  const isRerollable = currentBasePromptKey !== null && currentBasePromptKey !== 'photoRestorationPrompt';

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans p-4 sm:p-6 lg:p-8 transition-colors duration-300 pb-24">
      <div className="w-full">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-500">
            WOMEN STUDIO
          </h1>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">
                {language === 'vi' ? 'Hình khuôn mặt' : 'Face Photo'}
              </h2>
              <ImageUploader onImageUpload={handleImageUpload} previewUrl={previewUrl} language={language} />
            </div>
            
            <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">
                {language === 'vi' ? 'Kiểu ảnh' : 'Image Style'}
              </h2>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleStyleButtonClick('midAutumn')}
                  disabled={!imageFile || isLoading}
                  className="w-full py-3 px-4 text-md font-semibold rounded-xl text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-rose-500"
                >
                  {isLoading && loadingStyle === 'midAutumn' ? (language === 'vi' ? 'Đang tạo...' : 'Generating...') : (language === 'vi' ? 'Ảnh trung thu' : 'Mid-Autumn')}
                </button>
                <button
                  onClick={() => handleStyleButtonClick('fairyBeauty')}
                  disabled={!imageFile || isLoading}
                  className="w-full py-3 px-4 text-md font-semibold rounded-xl text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-pink-500"
                >
                  {isLoading && loadingStyle === 'fairyBeauty' ? (language === 'vi' ? 'Đang tạo...' : 'Generating...') : (language === 'vi' ? 'Thần tiên tỷ tỷ' : 'Fairy Beauty')}
                </button>
                 <button
                  onClick={() => handleStyleButtonClick('femaleCEO')}
                  disabled={!imageFile || isLoading}
                  className="w-full py-3 px-4 text-md font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
                >
                  {isLoading && loadingStyle === 'femaleCEO' ? (language === 'vi' ? 'Đang tạo...' : 'Generating...') : (language === 'vi' ? 'Nữ tổng tài' : 'Female CEO')}
                </button>
                <button
                  onClick={() => handleStyleButtonClick('photoRestoration')}
                  disabled={!imageFile || isLoading}
                  className="w-full py-3 px-4 text-md font-semibold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500"
                >
                  {isLoading && loadingStyle === 'photoRestoration' ? (language === 'vi' ? 'Đang tạo...' : 'Generating...') : (language === 'vi' ? 'Phục chế ảnh cũ' : 'Restore Old Photo')}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 h-[80vh] flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">
              {language === 'vi' ? 'Ảnh KOL' : 'KOL Portrait'}
            </h2>
            <div className="flex-grow min-h-0">
              <GeneratedImage 
                imageUrl={generatedUrl} 
                isLoading={isLoading}
                error={error} 
                language={language} 
                progress={progress}
                onQuickEditClick={() => setShowQuickEdit(true)}
                onDuplicateClick={handleDuplicateClick}
                isDuplicatable={!!generatedUrl && currentStyle !== null}
                isRerollable={isRerollable}
                onDownloadClick={handleDownloadClick}
                onShareClick={() => generatedUrl && handleShare(generatedUrl)}
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col h-[80vh]">
            <div className="flex justify-between items-baseline mb-4">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                {language === 'vi' ? 'Thư viện ảnh' : 'Gallery'}
              </h2>
            </div>
            <div className="flex-grow min-h-0">
              <HistoryPanel 
                historyItems={generatedHistory} 
                onImageSelect={handleHistorySelect} 
                onImageDelete={deleteHistoryItem}
                language={language}
                isLoading={isDbLoading}
              />
            </div>
          </div>
        </main>
      </div>
      <BottomBar 
        theme={theme}
        language={language}
        onThemeToggle={handleThemeToggle}
        onLanguageToggle={handleLanguageToggle}
      />
      {showConfirmation && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl max-w-md w-full text-center">
              <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
                {activeStyle === 'midAutumn' 
                  ? (language === 'vi' ? 'Chọn kiểu ảnh Trung thu' : 'Choose Mid-Autumn Style') 
                  : (language === 'vi' ? 'Chọn kiểu ảnh Nữ tổng tài' : 'Choose Female CEO Style')}
              </h3>
              <p className="mb-6 text-slate-600 dark:text-slate-300">{language === 'vi' ? 'Vui lòng chọn góc chụp bạn muốn tạo.' : 'Please select the shot type you want to generate.'}</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button onClick={() => handleConfirmation('full')} className="w-full px-4 py-3 rounded-lg bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500">
                  {language === 'vi' ? 'Toàn thân' : 'Full Body'}
                </button>
                <button onClick={() => handleConfirmation('half')} className="w-full px-4 py-3 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500">
                  {language === 'vi' ? 'Nửa người' : 'Half Body'}
                </button>
                <button onClick={() => handleConfirmation('close-up')} className="w-full px-4 py-3 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-amber-500">
                  {language === 'vi' ? 'Cận mặt' : 'Close-up'}
                </button>
              </div>
              <button onClick={handleCloseConfirmation} className="mt-6 text-sm text-slate-500 hover:text-slate-300 transition-colors">
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
            </div>
          </div>
        )}
        
        {showQuickEdit && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl max-w-lg w-full">
              <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
                {language === 'vi' ? 'Chỉnh sửa nhanh' : 'Quick Edit'}
              </h3>
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                {language === 'vi' ? 'Miêu tả những thay đổi bạn muốn áp dụng cho bức ảnh.' : 'Describe the changes you want to apply to the image.'}
              </p>
              <textarea
                value={quickEditPrompt}
                onChange={(e) => setQuickEditPrompt(e.target.value)}
                placeholder={language === 'vi' ? 'Ví dụ: đổi màu áo thành màu đỏ, thêm một chiếc vòng cổ...' : 'e.g., change the dress to red, add a necklace...'}
                className="w-full h-24 p-3 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-rose-500 focus:outline-none transition-colors"
                aria-label="Quick edit prompt"
              />
              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                <button 
                  onClick={() => setShowQuickEdit(false)} 
                  className="px-5 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                >
                  {language === 'vi' ? 'Hủy' : 'Cancel'}
                </button>
                <button 
                  onClick={handleQuickEditSubmit} 
                  disabled={!quickEditPrompt || isLoading}
                  className="px-5 py-2.5 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (language === 'vi' ? 'Đang chỉnh sửa...' : 'Editing...') : (language === 'vi' ? 'Chỉnh sửa' : 'Edit')}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default App;
