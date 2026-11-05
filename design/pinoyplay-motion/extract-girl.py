"""User-approved local silhouette extraction; original artwork pixels are preserved.

Run from the repository root. The narrow GrabCut band refines the hand-drawn
silhouette without generating or repainting the character. Occluded areas stay empty.
"""
from pathlib import Path
import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'public/assets/pinoyplay/slot-daily-rebate-v1.png'
DESTINATION = ROOT / 'public/assets/pinoyplay/slot-rebate-girl-v1.png'
image = Image.open(SOURCE).convert('RGBA')
pixels = np.array(image)

# Full-banner pixel coordinates, clockwise from the bat tip.
outline = [
    (1163,96),(1177,101),(1182,112),(1178,121),(1163,127),(1154,133),
    (1146,144),(1135,148),(1148,162),(1154,180),(1169,199),(1176,225),
    (1184,257),(1192,282),(1196,298),(1191,305),(1202,314),(1211,327),
    (1221,338),(1233,354),(1220,366),(1209,380),(1200,391),(1193,399),
    (1181,416),(1169,423),(1161,414),(1149,409),(1136,415),(1125,427),
    (1112,433),(1104,451),(1094,456),(1084,473),(1075,493),(1070,501),
    (1086,507),(1104,503),(1113,492),(1120,482),(1128,477),(1139,482),
    (1144,495),(1142,512),(1129,528),(1127,550),(1122,570),(1108,589),
    (1100,603),(1095,621),(1094,646),(1105,669),(1119,689),(1137,700),
    (1139,718),(1124,728),(1110,746),(1090,759),(1076,779),(1068,802),
    (1069,836),(472,836),(503,816),(539,793),(574,774),(605,759),
    (641,742),(676,725),(705,711),(715,679),(730,651),(746,624),
    (761,608),(776,597),(797,596),(821,600),(843,594),(866,587),
    (891,582),(917,577),(943,571),(967,560),(980,548),(973,533),
    (957,550),(937,564),(914,574),(890,574),(865,568),(846,557),
    (836,548),(825,557),(806,561),(790,555),(778,545),(757,547),
    (741,541),(727,532),(715,513),(709,494),(710,476),(700,464),
    (695,478),(688,484),(674,483),(658,473),(648,460),(645,444),
    (648,431),(658,419),(671,410),(679,405),(670,407),(658,414),
    (643,430),(639,448),(644,465),(637,473),(627,462),(622,443),
    (622,423),(628,404),(643,388),(658,381),(675,378),(690,377),
    (687,364),(674,353),(661,352),(651,356),(647,369),(654,382),
    (645,382),(633,374),(625,360),(624,347),(630,334),(639,323),
    (650,314),(662,308),(674,305),(687,305),(700,311),(712,319),
    (726,316),(736,306),(748,300),(759,290),(777,283),(790,274),
    (800,263),(817,256),(829,248),(836,231),(848,213),(860,199),
    (868,182),(881,169),(898,157),(914,148),(932,142),(950,142),
    (970,149),(985,158),(993,174),(994,186),(1009,192),(1023,195),
    (1038,186),(1055,181),(1074,174),(1085,166),(1094,155),(1097,144),
    (1103,134),(1112,129),(1122,128),(1131,128),(1140,116),(1152,109),
]
# Open space between the raised arm, hair and bat.
holes = [[
    (1043,207),(1072,188),(1097,175),(1110,164),(1118,178),(1125,198),
    (1132,224),(1141,249),(1147,271),(1135,280),(1128,273),(1110,266),
    (1080,249),(1060,236),(1043,222),
]]

silhouette = np.zeros(pixels.shape[:2], dtype=np.uint8)
cv2.fillPoly(silhouette, [np.array(outline, dtype=np.int32)], 255)
for hole in holes:
    cv2.fillPoly(silhouette, [np.array(hole, dtype=np.int32)], 0)
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
inner = cv2.erode(silhouette, kernel)
outer = cv2.dilate(silhouette, kernel)
labels = np.full(silhouette.shape, cv2.GC_BGD, dtype=np.uint8)
labels[outer > 0] = cv2.GC_PR_BGD
labels[silhouette > 0] = cv2.GC_PR_FGD
labels[inner > 0] = cv2.GC_FGD
cv2.grabCut(cv2.cvtColor(pixels[:, :, :3], cv2.COLOR_RGB2BGR), labels, None,
            np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64),
            5, cv2.GC_INIT_WITH_MASK)
alpha = np.where((labels == cv2.GC_FGD) | (labels == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
# Clear the original rabbit's occlusion using its separately approved foreground
# layer. This creates the matching empty area behind the animated foreground.
rabbit = np.array(Image.open(ROOT / 'public/assets/pinoyplay/slot-rebate-rabbit-v1.png').getchannel('A'))
rabbit = cv2.dilate(np.where(rabbit > 80, 255, 0).astype(np.uint8), np.ones((7, 7), np.uint8))
alpha[rabbit > 0] = 0
# Navy header remnants beside the hair and raised arm are background,
# while warm hair/skin and cyan fabric are retained from the original pixels.
r, g, b = [pixels[:, :, i].astype(np.float32) for i in range(3)]
navy = (b > r * 1.35) & (b > g * 1.25)
header_edge = np.zeros(alpha.shape, dtype=bool)
header_edge[130:220, 940:1060] = True
header_edge[205:282, 1050:1147] = True
alpha[header_edge & navy] = 0
hair_gap = np.zeros(alpha.shape, dtype=bool)
hair_gap[300:575, 605:740] = True
alpha[hair_gap & navy] = 0
# Subpixel edge softness only; no broad halo and no RGB repainting.
pixels[:, :, 3] = cv2.GaussianBlur(alpha, (3, 3), .55)
pixels[pixels[:, :, 3] == 0, :3] = 0
Image.fromarray(pixels).save(DESTINATION)
print(f'Saved {DESTINATION} ({image.width} x {image.height}, original RGB pixels)')
