import methods from '../modules/methods';
import enums from '../enums';
import user from '../user';
import timer from "./timer";

let object = {};

let loadDist = 150;
let objectList = [];
let iplList = [];
let emitterList = [];
let objectDelList = [];
let doorList = [];

object.load = function () {
    const start = new Date().getTime();

    /*enums.customIpl.forEach(item => {
        object.createIpl(item[0], new mp.Vector3(item[1], item[2], item[3]), item[4]);
    });*/

    enums.emitters.forEach(item => {
        object.createEmitter(new mp.Vector3(item[0], item[1], item[2]));
    });

    //Island Flags
    object.create(-1207959739, new mp.Vector3(4995.672, -5756.384, 18.35521), new mp.Vector3(0, 0, 0), false, false);
    object.create(-1207959739, new mp.Vector3(5001.14, -5753.695, 31.8577), new mp.Vector3(0, 0, 0), false, false);
    object.create(-1419002455, new mp.Vector3(5001.071, -5753.72, 38.17886), new mp.Vector3(0, 0, 0), false, false);
    object.create(11846651, new mp.Vector3(4995.68, -5756.458, 24.68), new mp.Vector3(0, 0, 0), false, false);
    object.create(-686248546, new mp.Vector3(4980.165, -5703.311, 18.88695), new mp.Vector3(0, 0, 0), false, false);
    object.create(-686248546, new mp.Vector3(4974.584, -5709.297, 18.88695), new mp.Vector3(0, 0, 0), false, false);
    object.create(-716201733, new mp.Vector3(4974.48, -5709.284, 27.51553), new mp.Vector3(0, 0, 0), false, false);
    object.create(-716201733, new mp.Vector3(4980.06, -5703.31, 27.3733), new mp.Vector3(0, 0, 0), false, false);
    object.create(-1207959739, new mp.Vector3(4976.202, -5607.503, 23.93197), new mp.Vector3(0, 0, 0), false, false);
    object.create(11846651, new mp.Vector3(4976.169, -5607.437, 29.81887), new mp.Vector3(0, 0, 0), false, false);
    object.create(-1207959739, new mp.Vector3(5136.644, -4942.788, 13.76766), new mp.Vector3(0, 0, 0), false, false);
    object.create(11846651, new mp.Vector3(5136.615, -4942.72, 19.82611), new mp.Vector3(0, 0, 0), false, false);
    object.create(-1207959739, new mp.Vector3(4367.801, -4576.191, 18.9678), new mp.Vector3(0, 0, 0), false, false);
    object.create(-716201733, new mp.Vector3(4367.815, -4576.119, 24.81057), new mp.Vector3(0, 0, 0), false, false);
    object.create(-1207959739, new mp.Vector3(5028.898, -4620.816, 2.996087), new mp.Vector3(0, 0, 0), false, false);
    object.create(-716201733, new mp.Vector3(5028.889, -4620.743, 8.898414), new mp.Vector3(0, 0, 0), false, false);
    object.create(-1207959739, new mp.Vector3(5008.206, -5163.938, 13.5064), new mp.Vector3(0, 0, 0), false, false);
    object.create(-716201733, new mp.Vector3(5008.136, -5163.962, 19.30302), new mp.Vector3(0, 0, 0), false, false);


//Island Market
    object.create(-1184096195, new mp.Vector3(5071.319, -4601.176, 2.29), new mp.Vector3(-4.462359E-05, 2.23118E-05, -23), false, false);
    object.create(-1184096195, new mp.Vector3(5069.569, -4600.409, 2.29), new mp.Vector3(-4.462359E-05, 2.23118E-05, -23), false, false);
    object.create(-1184096195, new mp.Vector3(5067.767, -4599.629, 2.29), new mp.Vector3(-4.462359E-05, 2.23118E-05, -23), false, false);
    object.create(-1184096195, new mp.Vector3(5065.592, -4598.685, 2.29), new mp.Vector3(-4.462359E-05, 2.23118E-05, -23), false, false);
    object.create(-1184096195, new mp.Vector3(5063.252, -4597.795, 2.29), new mp.Vector3(-4.462359E-05, 2.23118E-05, -23), false, false);
    object.create(-1184096195, new mp.Vector3(5060.733, -4596.791, 2.29), new mp.Vector3(-4.462359E-05, 2.23118E-05, -23), false, false);
    object.create(-1184096195, new mp.Vector3(5058.086, -4595.743, 2.29), new mp.Vector3(-4.462468E-05, -0.07494948, -19.84949), false, false);
    object.create(-1184096195, new mp.Vector3(5055.809, -4594.952, 2.29), new mp.Vector3(-4.462468E-05, -0.07494948, -19.84949), false, false);
    object.create(-1184096195, new mp.Vector3(5052.184, -4590.992, 2.29), new mp.Vector3(1.574951, -5.017816E-06, 66.39991), false, false);
    object.create(-1184096195, new mp.Vector3(5051.262, -4593.122, 2.29), new mp.Vector3(1.574951, -4.804292E-06, 66.39989), false, false);
    object.create(-1184096195, new mp.Vector3(5054.419, -4589.825, 2.29), new mp.Vector3(1.574943, -4.911054E-06, 159.8982), false, false);
    object.create(-1184096195, new mp.Vector3(5058.152, -4589.025, 2.29), new mp.Vector3(1.574943, -4.911054E-06, 159.8982), false, false);
    object.create(-1184096195, new mp.Vector3(5060.256, -4589.745, 2.29), new mp.Vector3(1.574943, -4.911054E-06, 159.8982), false, false);
    object.create(-1184096195, new mp.Vector3(5069.907, -4595.168, 2.29), new mp.Vector3(1.574943, -4.911054E-06, 159.8982), false, false);
    object.create(-1184096195, new mp.Vector3(5072.198, -4596, 2.29), new mp.Vector3(1.574943, -4.911054E-06, 159.8982), false, false);
    object.create(-1184096195, new mp.Vector3(5074.832, -4598.938, 2.29), new mp.Vector3(1.574943, -4.911054E-06, 159.8982), false, false);
    object.create(-1184096195, new mp.Vector3(5077.178, -4599.892, 2.29), new mp.Vector3(1.574943, -4.911054E-06, 159.8982), false, false);
    object.create(-565489442, new mp.Vector3(5075.589, -4605.053, 1.834077), new mp.Vector3(0, 0, -14.99998), false, false);
    object.create(-565489442, new mp.Vector3(5072.811, -4604.169, 1.838017), new mp.Vector3(0, 0, -25.99995), false, false);
    object.create(-565489442, new mp.Vector3(5051.111, -4595.586, 1.904237), new mp.Vector3(0, 0, -17.99998), false, false);

    object.deleteMapEditor(5061.75, -4589.056, 2.818717, 1, 1343261146, 0);
    object.deleteMapEditor(5061.08, -4590.327, 1.90803, 1, 1948359883, 0);
    object.deleteMapEditor(5059.158, -4589.358, 1.922903, 1, -191836989, 0);
    object.deleteMapEditor(5059.86, -4587.98, 1.935988, 1, 1370563384, 0);
    object.deleteMapEditor(5059.922, -4589.056, 2.33478, 1, 1474888937, 0);
    object.deleteMapEditor(5060.395, -4588.927, 1.917055, 1, -13720938, 0);
    object.deleteMapEditor(5057.586, -4589.268, 2.244055, 1, -2073573168, 0);
    object.deleteMapEditor(5058.045, -4587.659, 1.937828, 1, 1615800919, 0);
    object.deleteMapEditor(5056.174, -4588.975, 1.902013, 1, 897494494, 0);
    object.deleteMapEditor(5054.388, -4588.731, 1.906381, 1, 1935071027, 0);
    object.deleteMapEditor(5051.747, -4590.146, 1.895035, 1, 895484294, 0);
    object.deleteMapEditor(5062.199, -4592.222, 2.438402, 1, 1138020438, 0);
    object.deleteMapEditor(5061.704, -4591.966, 1.883105, 1, -1438964996, 0);
    object.deleteMapEditor(5061.629, -4591.94, 2.789317, 1, 247892203, 0);
    object.deleteMapEditor(5071.256, -4595.093, 2.812273, 1, 1343261146, 0);
    object.deleteMapEditor(5072.488, -4595.063, 2.653174, 1, 300547451, 0);
    object.deleteMapEditor(5072.183, -4596.313, 1.836475, 1, 282166596, 0);
    object.deleteMapEditor(5073.416, -4597.11, 1.865145, 1, 2005215959, 0);
    object.deleteMapEditor(5074.043, -4598.187, 1.851134, 1, -921781850, 0);
    object.deleteMapEditor(5074.769, -4597.704, 2.146525, 1, 1652026494, 0);
    object.deleteMapEditor(5075.48, -4598.976, 1.879523, 1, 396412624, 0);
    object.deleteMapEditor(5077.658, -4599.108, 1.915225, 1, 1935071027, 0);
    object.deleteMapEditor(5074.318, -4598.614, 1.850677, 1, 786272259, 0);
    object.deleteMapEditor(5077.183, -4600.122, 1.91257, 1, 702767871, 0);
    object.deleteMapEditor(5077.771, -4600.595, 1.927475, 1, -1438964996, 0);
    object.deleteMapEditor(5077.159, -4601.109, 1.9228, 1, -566369276, 0);
    object.deleteMapEditor(5067.123, -4599.368, 1.878296, 1, -371004270, 0);
    object.deleteMapEditor(5065.561, -4599.405, 1.849507, 1, 1615800919, 0);
    object.deleteMapEditor(5066.883, -4600.181, 1.853649, 1, 1165008631, 0);
    object.deleteMapEditor(5068.104, -4600.733, 2.024274, 1, 437765445, 0);
    object.deleteMapEditor(5063.291, -4598.634, 1.856762, 1, 1370563384, 0);
    object.deleteMapEditor(5062.277, -4597.829, 1.940358, 1, -566369276, 0);
    object.deleteMapEditor(5064.319, -4598.808, 1.859117, 1, -130812911, 0);
    object.deleteMapEditor(5060.533, -4598.292, 2.760238, 1, 1343261146, 0);

//Island Cloth
    object.create(-297318917, new mp.Vector3(5006.402, -5785.698, 17.98), new mp.Vector3(0, 0, 35.89992), false, false);
    object.create(-1251029815, new mp.Vector3(5008.29, -5790.62, 16.85), new mp.Vector3(-1.500009, -5.071018E-06, 123.5), false, false);
    object.create(-429845122, new mp.Vector3(5009.3, -5788.096, 17.98555), new mp.Vector3(0, 0, -55.99982), false, false);
    object.create(-88789715, new mp.Vector3(5005.966, -5785.952, 17.79131), new mp.Vector3(0, 0, 123.3994), false, false);
    object.create(-962367694, new mp.Vector3(5012.502, -5788.643, 17.79131), new mp.Vector3(0, 0, -145.999), false, false);
    object.create(-1973732036, new mp.Vector3(5009.923, -5789.609, 16.8317), new mp.Vector3(0, 0, -59.1), false, false);
    object.create(-131638424, new mp.Vector3(5007.34, -5789.72, 17.9314), new mp.Vector3(0, 0, 122.9995), false, false);


    object.deleteMapEditor(5009.42, -5788.615, 16.83161, 1, 452859308, 0);
    object.deleteMapEditor(5009.629, -5788.755, 16.83161, 1, -244465020, 0);
    object.deleteMapEditor(5010.445, -5790.091, 16.83161, 1, 120581640, 0);
    object.deleteMapEditor(5007.445, -5789.441, 16.83161, 1, -1387569492, 0);

//Island 24/7
    object.create(-2146133119, new mp.Vector3(5029.39, -5736.08, 16.86559), new mp.Vector3(0, 0, 47.99991), false, false);
    object.create(-297318917, new mp.Vector3(5029.192, -5736.371, 18.06), new mp.Vector3(1.001791E-05, 2.23118E-05, 47.99999), false, false);
    object.create(-844425980, new mp.Vector3(5024.008, -5736.291, 19), new mp.Vector3(0, 0, -131.0984), false, false);
    object.create(1421582485, new mp.Vector3(5032.362, -5736.671, 17.79), new mp.Vector3(-4.458299E-05, -0.2999223, -130.439), false, false);
    object.create(1437777724, new mp.Vector3(5025.81, -5737.4, 17.56), new mp.Vector3(1.001791E-05, 2.23118E-05, 138.5), false, false);
    object.create(643522702, new mp.Vector3(5027.18, -5735.85, 17.56), new mp.Vector3(0, 0, 138.4991), false, false);
    object.create(-54719154, new mp.Vector3(5031.737, -5737.971, 17.5406), new mp.Vector3(0, 0, -41.0999), false, false);
    object.create(-870868698, new mp.Vector3(5028.01, -5732.681, 16.86559), new mp.Vector3(0, 0, -39.39994), false, false);
    object.create(-54719154, new mp.Vector3(5025.9, -5737.49, 17.57669), new mp.Vector3(6.106665E-13, -5.008956E-06, 138.5), false, false);
    object.create(-220235377, new mp.Vector3(5027.272, -5735.932, 17.56), new mp.Vector3(1.00179E-05, 5.008955E-06, 138.6491), false, false);
    object.create(548760764, new mp.Vector3(5030.461, -5739.33, 19.95), new mp.Vector3(0, 0, 170.8974), false, false);
    object.create(548760764, new mp.Vector3(5025.627, -5739.747, 17.12717), new mp.Vector3(0, 0, 0), false, false);
    object.create(1262567554, new mp.Vector3(5026.7, -5739.13, 17.97), new mp.Vector3(4.07111E-13, -5.008956E-06, -132.3243), false, false);
    object.create(1262567554, new mp.Vector3(5027.72, -5738, 17.97), new mp.Vector3(0, -5.008956E-06, -132.3243), false, false);
    object.create(-304627501, new mp.Vector3(5029.407, -5736.095, 16.86559), new mp.Vector3(0, 0, 47.80083), false, false);
    object.create(-304627501, new mp.Vector3(5029.699, -5737.859, 16.86559), new mp.Vector3(0, 0, 137.8002), false, false);
    object.create(-1720674274, new mp.Vector3(5029.051, -5733.619, 16.86559), new mp.Vector3(0, 0, -42.99991), false, false);
    object.create(18704222, new mp.Vector3(5029.708, -5734.269, 16.86559), new mp.Vector3(0, 0, -41.19988), false, false);

    object.deleteMapEditor(5027.595, -5737.441, 16.8655, 1, -244465020, 0);
    object.deleteMapEditor(5027.688, -5737.207, 16.8655, 1, 452859308, 0);
    object.deleteMapEditor(5027.832, -5736.853, 16.8655, 1, -1387569492, 0);

    //Island Gas
    object.create(-478519537, new mp.Vector3(5154.589, -5136.641, 5.9), new mp.Vector3(0, 0, 0), false, false);
    object.create(1339433404, new mp.Vector3(5158.693, -5134.595, 1.355109), new mp.Vector3(0, 0, 89.49966), false, false);
    object.create(1339433404, new mp.Vector3(5153.424, -5134.496, 1.300192), new mp.Vector3(0, 0, 89.49965), false, false);

    object.deleteMapEditor(5152.524, -5134.814, 2.189874, 1, 1343261146, 0);


//Island Mask
    object.create(-297318917, new mp.Vector3(5082.836, -5758.652, 15.97), new mp.Vector3(0, 0, 141.9992), false, false);
    object.create(-1619952456, new mp.Vector3(5083.006, -5758.6, 15.1), new mp.Vector3(0, 0, -36.99992), false, false);
    object.create(1064067787, new mp.Vector3(5082.317, -5757.146, 14.82965), new mp.Vector3(0, 0, 52.99987), false, false);
    object.create(1841479543, new mp.Vector3(5081.933, -5756.834, 14.82965), new mp.Vector3(0, 0, -38.99991), false, false);
    object.create(146536570, new mp.Vector3(5083.63, -5755.742, 15.59), new mp.Vector3(0, 0, 48.99991), false, false);


//Island Houses
    object.create(-332287871, new mp.Vector3(4794.793, -4310.277, 3.407761), new mp.Vector3(-2.001032E-08, -0.3000451, -113.8241), false, false);
    object.create(22143489, new mp.Vector3(4788.483, -4294.286, 3.769139), new mp.Vector3(-0.8250495, -5.069806E-06, 63.50023), false, false);
    object.create(1465091378, new mp.Vector3(4811.075, -4293.696, 4.114414), new mp.Vector3(1.001789E-05, -5.008956E-06, 170.7735), false, false);
    object.create(1465091378, new mp.Vector3(4826.479, -4300.778, 4.106608), new mp.Vector3(0, 0, 141.9995), false, false);
    object.create(-332287871, new mp.Vector3(5100.862, -4668.468, 1.278735), new mp.Vector3(-1.067217E-07, -0.3000444, 78.07652), false, false);
    object.create(-332287871, new mp.Vector3(5119.956, -4702.775, 1.531165), new mp.Vector3(-2.334537E-07, -0.3000441, -17.92485), false, false);
    object.create(-332287871, new mp.Vector3(5077.463, -4548.335, 3.668827), new mp.Vector3(-4.702425E-07, -0.3000441, 81.07547), false, false);
    object.create(1465091378, new mp.Vector3(5126.806, -4703.344, 1.649491), new mp.Vector3(0, 0, -107.0007), false, false);
    object.create(1465091378, new mp.Vector3(5169.68, -4628.033, 1.665529), new mp.Vector3(0, 0, 137.9993), false, false);
    object.create(-332287871, new mp.Vector3(5174.86, -4693.084, 0.9811068), new mp.Vector3(-2.334537E-07, -0.3000439, 11.07516), false, false);
    object.create(2122660754, new mp.Vector3(5156.372, -4684.466, 1.2131), new mp.Vector3(1.011188E-05, -0.1500542, 117.1492), false, false);
    object.create(-964112964, new mp.Vector3(5489.316, -5820.506, 17.89), new mp.Vector3(-0.1655264, -4.995931E-06, -45.65923), false, false);
    object.create(-1634847635, new mp.Vector3(5161.015, -4680.834, 1.345085), new mp.Vector3(0, 0, -67.39983), false, false);
    object.create(-1634847635, new mp.Vector3(5161.838, -4682.633, 1.331546), new mp.Vector3(0, 0, -67.39983), false, false);
    object.create(-1634847635, new mp.Vector3(5162.36, -4683.727, 1.385056), new mp.Vector3(0, 0, -66.3995), false, false);
    object.create(-1634847635, new mp.Vector3(5161.722, -4685.278, 1.306129), new mp.Vector3(0, 0, -143.399), false, false);
    object.create(-1634847635, new mp.Vector3(5159.521, -4689.218, 1.254595), new mp.Vector3(0, 0, -59.39843), false, false);
    object.create(-1634847635, new mp.Vector3(5159.503, -4691.395, 1.229115), new mp.Vector3(0, 0, -124.3981), false, false);
    object.create(-1147503786, new mp.Vector3(5163.226, -4689.572, 1.266059), new mp.Vector3(0, 0, -85.99974), false, false);
    object.create(1465091378, new mp.Vector3(5126.591, -4693.958, 0.9636217), new mp.Vector3(0, 0, -18.0003), false, false);
    object.create(1465091378, new mp.Vector3(5182.086, -4658.252, 1.382018), new mp.Vector3(1.001791E-05, -5.008955E-06, -102.3752), false, false);
    object.create(-332287871, new mp.Vector3(5498.851, -5834.521, 17.79531), new mp.Vector3(-2.668042E-07, -0.3000439, 38.07512), false, false);
    object.create(-332287871, new mp.Vector3(5498.851, -5834.521, 17.79531), new mp.Vector3(-2.668042E-07, -0.3000439, 38.07512), false, false);
    object.create(1465091378, new mp.Vector3(5485.312, -5869.082, 18.17778), new mp.Vector3(-1.155822, 4.990254E-06, 20.2797), false, false);
    object.create(1465091378, new mp.Vector3(5459.293, -5837.586, 18.4736), new mp.Vector3(-1.155823, 4.883512E-06, -113.7199), false, false);
    object.create(1465091378, new mp.Vector3(5457.648, -5854.761, 18.42572), new mp.Vector3(-1.155823, 4.483223E-06, -62.71957), false, false);
    object.create(1465091378, new mp.Vector3(5467.908, -5866.778, 18.49146), new mp.Vector3(-1.155823, 5.070312E-06, -28.11938), false, false);
    object.create(22143489, new mp.Vector3(5478.242, -5851.755, 18.5459), new mp.Vector3(-0.8250495, -5.069806E-06, 63.50023), false, false);
    object.create(22143489, new mp.Vector3(5477.426, -5841.385, 17.92194), new mp.Vector3(-0.8250495, 4.989757E-06, -116.724), false, false);
    object.create(1465091378, new mp.Vector3(5480.002, -5834.122, 18.14531), new mp.Vector3(-1.155822, 4.963568E-06, -26.91949), false, false);
    object.create(1465091378, new mp.Vector3(5473.691, -5857.524, 18.87201), new mp.Vector3(-1.155823, 5.070313E-06, 154.8804), false, false);
    object.create(-332287871, new mp.Vector3(5124.059, -5074.823, 0.956337), new mp.Vector3(-5.502837E-07, -0.3000436, 81.07392), false, false);
    object.create(1465091378, new mp.Vector3(5015.409, -5113.882, 1.479272), new mp.Vector3(0, 0, -143.001), false, false);
    object.create(1465091378, new mp.Vector3(5007.448, -5127.7, 1.520102), new mp.Vector3(0, 0, -107.0006), false, false);
    object.create(1465091378, new mp.Vector3(4953.598, -5117.606, 1.777725), new mp.Vector3(0, 0, -23.00007), false, false);
    object.create(1465091378, new mp.Vector3(4916.253, -5199.64, 1.448806), new mp.Vector3(0, 0, 122), false, false);
    object.create(1465091378, new mp.Vector3(4489.521, -4515.363, 2.845903), new mp.Vector3(1.001787E-05, -5.008952E-06, 18.77373), false, false);
    object.create(1465091378, new mp.Vector3(4531.188, -4498.097, 3.104432), new mp.Vector3(1.001787E-05, -5.008952E-06, 18.77374), false, false);
    object.create(1465091378, new mp.Vector3(4473.169, -4538.459, 3.269044), new mp.Vector3(1.001786E-05, -5.008936E-06, -75.22583), false, false);
    object.create(1465091378, new mp.Vector3(4479.965, -4554.271, 4.096382), new mp.Vector3(1.001783E-05, 5.008956E-06, -60.74984), false, false);

    //Island Angar
    object.create(-1683613150, new mp.Vector3(4445.623, -4478.575, 1.17), new mp.Vector3(0, 0, -69.49982), false, false);
    object.create(-1683613150, new mp.Vector3(4432.814, -4466.47, 10.6), new mp.Vector3(1.067217E-06, -78.96844, -160.117), false, false);

//Island Hosp
    object.create(-1091386327, new mp.Vector3(4964.996, -5789.086, 25.76), new mp.Vector3(0, 0, -26.99996), false, false);
    object.create(1020863041, new mp.Vector3(4962.18, -5788.13, 25.17), new mp.Vector3(0, 0, -117.0004), false, false);
    object.create(813074696, new mp.Vector3(4959.077, -5789.117, 26.07437), new mp.Vector3(0, 0, 153.6991), false, false);
    object.create(705176663, new mp.Vector3(4959.602, -5787.934, 26.07437), new mp.Vector3(0, 0, 61.99985), false, false);
    object.create(-509973344, new mp.Vector3(4961.307, -5783.889, 26.802), new mp.Vector3(0, 0, 62.79993), false, false);
    object.create(333086378, new mp.Vector3(4960.351, -5786.538, 26.07417), new mp.Vector3(0, 0, 58.99983), false, false);
    object.create(-246597232, new mp.Vector3(4960.713, -5785.942, 26.07417), new mp.Vector3(0, 0, 69.99981), false, false);
    object.create(-1963803813, new mp.Vector3(4962.928, -5787.229, 25.66), new mp.Vector3(1.250002, -4.856994E-06, 154.7486), false, false);
    object.create(851362411, new mp.Vector3(4960.894, -5785.458, 26.07417), new mp.Vector3(0, 0, 27.99997), false, false);
    object.create(388753871, new mp.Vector3(4959.421, -5788.595, 26.07421), new mp.Vector3(0, 0, 63.99984), false, false);
    object.create(79058805, new mp.Vector3(4959.151, -5788.465, 26.07437), new mp.Vector3(0, 0, -119.0004), false, false);
    object.create(886033073, new mp.Vector3(4958.594, -5789.95, 25.42), new mp.Vector3(0, 0, 63.99994), false, false);
    object.create(-502202673, new mp.Vector3(4958.868, -5788.902, 25.27131), new mp.Vector3(0, 0, 60.99979), false, false);
    object.create(-1091386327, new mp.Vector3(4962.491, -5792.693, 25.76), new mp.Vector3(1.001778E-05, 5.008956E-06, 62.99969), false, false);
    object.create(-1091386327, new mp.Vector3(4960.312, -5791.499, 25.76), new mp.Vector3(1.001778E-05, 5.008956E-06, 62.99969), false, false);
    object.create(1020863041, new mp.Vector3(4962.84, -5788.46, 25.17), new mp.Vector3(1.001783E-05, 5.008956E-06, 63.29964), false, false);
    object.create(-128924068, new mp.Vector3(4964.5, -5785.018, 25.64), new mp.Vector3(0, 0, -116.9995), false, false);
    object.create(-2146133119, new mp.Vector3(4962.655, -5784.749, 25.27131), new mp.Vector3(0, 0, 63.99974), false, false);
    object.create(2109346928, new mp.Vector3(4962.684, -5784.781, 26.25), new mp.Vector3(0, 0, -115.9995), false, false);
    object.create(1830344521, new mp.Vector3(4962.382, -5784.995, 26.27255), new mp.Vector3(0, 0, -137.9994), false, false);
    object.create(1151364435, new mp.Vector3(4962.758, -5784.389, 26.28), new mp.Vector3(0, 0, 0), false, false);
    object.create(-606800174, new mp.Vector3(4962.312, -5784.012, 25.27131), new mp.Vector3(0, 0, -8.000059), false, false);
    object.create(-1842407088, new mp.Vector3(4966.465, -5794.646, 28.93669), new mp.Vector3(0, 0, 0), false, false);

    object.deleteMapEditor(4962.833, -5788.261, 26.21429, 1, -755359081, 0);
    object.deleteMapEditor(4962.713, -5789.669, 25.20009, 1, -1761659350, 0);
    object.deleteMapEditor(4963.12, -5788.663, 26.02156, 1, 996113921, 0);
    object.deleteMapEditor(4962.458, -5787.452, 25.19645, 1, -1761659350, 0);
    object.deleteMapEditor(4963.32, -5792.228, 25.19949, 1, 1883518564, 0);
    object.deleteMapEditor(4963.266, -5793.073, 25.5316, 1, 1909201504, 0);
    object.deleteMapEditor(4963.676, -5792.532, 25.19333, 1, 640567599, 0);
    object.deleteMapEditor(4963.255, -5792.891, 25.59501, 1, -1387569492, 0);
    object.deleteMapEditor(4959.46, -5789.381, 25.21374, 1, 640567599, 0);
    object.deleteMapEditor(4959.064, -5788.866, 26.06205, 1, 518175384, 0);
    object.deleteMapEditor(4959.048, -5789.199, 26.08577, 1, -1387569492, 0);
    object.deleteMapEditor(4959.22, -5788.394, 26.06205, 1, 1526872603, 0);
    object.deleteMapEditor(4959.29, -5788.7, 26.07371, 1, 14583253, 0);
    object.deleteMapEditor(4960.948, -5785.841, 26.07934, 1, 518175384, 0);
    object.deleteMapEditor(4960.522, -5785.747, 26.07371, 1, -244465020, 0);
    object.deleteMapEditor(4961.068, -5785.469, 26.07371, 1, 14583253, 0);
    object.deleteMapEditor(4960.899, -5785.129, 26.07934, 1, 41845200, 0);
    object.deleteMapEditor(4961.096, -5785.463, 25.19335, 1, 452859308, 0);
    object.deleteMapEditor(4961.442, -5784.669, 25.20721, 1, -1387569492, 0);
    object.deleteMapEditor(4961.78, -5784.102, 25.20569, 1, 119729119, 0);
    object.deleteMapEditor(4962.18, -5784.298, 25.24935, 1, -1737949350, 0);
    object.deleteMapEditor(4962.413, -5784.079, 25.41332, 1, -755359081, 0);
    object.deleteMapEditor(4962.694, -5788.428, 25.59979, 1, 702477265, 0);

    //LifeInvader интерьер
    object.create(1355733718, new mp.Vector3(-1079.415, -251.3165, 43.99629), new mp.Vector3(1.001787E-05, 5.008957E-06, -119.4992), false, false);
    object.create(1355733718, new mp.Vector3(-1079.247, -247.1402, 43.99629), new mp.Vector3(0, 0, -66.49946), false, false);
    object.create(1792816905, new mp.Vector3(-1081.293, -251.8282, 43.99614), new mp.Vector3(1.221333E-12, 5.008955E-06, -146.9997), false, false);
    object.create(1792816905, new mp.Vector3(-1080.26, -245.6704, 43.99629), new mp.Vector3(0, 0, -58.99958), false, false);
    object.create(1792816905, new mp.Vector3(-1078.498, -249.3357, 43.99629), new mp.Vector3(1.00179E-05, -5.008954E-06, -94.24939), false, false);
    object.create(696447118, new mp.Vector3(-1078.735, -247.8944, 43.02128), new mp.Vector3(0, 0, -62.99974), false, false);
    object.create(696447118, new mp.Vector3(-1078.68, -250.6581, 43.02113), new mp.Vector3(0, 0, -128.9995), false, false);
    object.create(709417929, new mp.Vector3(-1091.468, -253.3232, 41.78119), new mp.Vector3(0, 0, 5.999994), false, false);
    object.create(536071214, new mp.Vector3(-1053.03, -229.92, 43.02089), new mp.Vector3(0, 0, -46.49986), false, false);
    object.create(536071214, new mp.Vector3(-1057.63, -232.25, 43.02113), new mp.Vector3(0, 0, 37.50003), false, false);
    object.create(746336278, new mp.Vector3(-1083.916, -247.076, 43.75), new mp.Vector3(0, 0, 0), false, false);
    object.create(1051204975, new mp.Vector3(-1078.461, -248.5285, 43.02128), new mp.Vector3(0, 0, -26), false, false);
    object.create(1051204975, new mp.Vector3(-1078.469, -250.0712, 43.02113), new mp.Vector3(0, 0, -26), false, false);
    object.create(-1585232418, new mp.Vector3(-1078.547, -250.2714, 43.85), new mp.Vector3(-90, -73.99981, 0), false, false);
    object.create(-163314598, new mp.Vector3(-1078.302, -250.214, 43.84578), new mp.Vector3(0, 0, -50.99999), false, false);
    object.create(-163314598, new mp.Vector3(-1078.278, -248.3383, 43.84593), new mp.Vector3(0, 0, -144.9998), false, false);
    object.create(-1906181505, new mp.Vector3(-1078.408, -249.9443, 43.9), new mp.Vector3(0, 0, 174.5), false, false);
    object.create(-502024136, new mp.Vector3(-1078.677, -248.6647, 43.84593), new mp.Vector3(0, 0, -145.5), false, false);
    object.create(-4948487, new mp.Vector3(-1078.438, -248.5448, 43.84593), new mp.Vector3(0, 0, -144.9998), false, false);
    object.create(1390116040, new mp.Vector3(-1091.935, -251.1477, 42.00567), new mp.Vector3(0, 0, -34.99997), false, false);
    object.create(-1719175883, new mp.Vector3(-1092.888, -254.6802, 41.99265), new mp.Vector3(0, 0, -15.99998), false, false);
    object.create(-925658112, new mp.Vector3(-1081.661, -250.5212, 43.63), new mp.Vector3(-90, 127.5001, 0), false, false);
    object.create(1130651494, new mp.Vector3(-1042.862, -232.5454, 43.02116), new mp.Vector3(0, 0, -57.99963), false, false);
    object.create(1130651494, new mp.Vector3(-1042.169, -233.9434, 43.02104), new mp.Vector3(0, 0, -61.9996), false, false);
    object.create(1130651494, new mp.Vector3(-1041.519, -235.3501, 43.02104), new mp.Vector3(0, 0, -57.99956), false, false);
    object.create(1130651494, new mp.Vector3(-1040.733, -237.2796, 43.02104), new mp.Vector3(0, 0, -83.99937), false, false);
    object.create(1130651494, new mp.Vector3(-1041.972, -239.9454, 43.02104), new mp.Vector3(0, 0, -158.9994), false, false);
    object.create(1130651494, new mp.Vector3(-1044.913, -239.2634, 43.02104), new mp.Vector3(0, 0, 133.0004), false, false);
    object.create(1130651494, new mp.Vector3(-1045.702, -237.8176, 43.02104), new mp.Vector3(0, 0, 135.0004), false, false);
    object.create(1130651494, new mp.Vector3(-1046.616, -236.1611, 43.02104), new mp.Vector3(0, 0, 117.0002), false, false);
    object.create(1130651494, new mp.Vector3(-1047.458, -234.5224, 43.02116), new mp.Vector3(0, 0, 103), false, false);
    object.create(1130651494, new mp.Vector3(-1048.162, -232.9514, 43.02116), new mp.Vector3(0, 0, 87.99976), false, false);
    object.create(1130651494, new mp.Vector3(-1046.809, -230.1328, 43.02116), new mp.Vector3(0, 0, 28.99964), false, false);
    object.create(1130651494, new mp.Vector3(-1044.043, -230.8033, 43.02116), new mp.Vector3(0, 0, -36.99955), false, false);

    object.delete(536071214, -1053.044, -230.3057, 43.02295);
    object.delete(536071214, -1057.119, -232.5291, 43.02295);
    object.delete(536071214, -1043.983, -238.3874, 43.02295);
    object.delete(536071214, -1045.024, -236.1517, 43.02295);
    object.delete(536071214, -1045.896, -234.217, 43.02295);
    object.delete(536071214, -1044.528, -232.0928, 43.02295);
    object.delete(536071214, -1043.487, -234.3285, 43.02295);
    object.delete(536071214, -1042.615, -236.2632, 43.02295);
    object.delete(536071214, -1082.213, -245.4019, 36.76302);
    object.delete(-67906175, -1041.826, -239.7872, 43.021);

    // Колонки на заправке LTD Grapeseed
    object.create(-164877493, new mp.Vector3(1690.1, 4927.81, 41.23172), new mp.Vector3(0, 0, -125), false, false);
    object.create(-164877493, new mp.Vector3(1684.59, 4931.65, 41.23172), new mp.Vector3(0, 0, -125), false, false);

    // Удаленные объекты в гараже Arcadius
    object.delete(682074297, -159.213, -577.0652, 31.4243);
    object.delete(765541575, -157.2606, -578.0063, 31.4192);
    object.delete(31071109, -156.353, -577.0887, 31.4192);
    object.delete(765541575, -154.8471, -578.4473, 31.4192);
    object.delete(-2096130282, -154.4395, -577.1686, 32.38988);
    object.delete(1506454359, -155.0695, -577.3192, 32.63888);
    object.delete(-246563715, -158.1, -577.4991, 32.38954);
    object.delete(648185618, -153.6201, -577.7612, 31.42653);
    object.delete(-1784486639, -153.2719, -578.2529, 31.5959);

    // South Docks
    object.delete(1230099731, 801.6791, -3150.104, 5.911598); // Шлагбаум на выезд с южных доков
    object.delete(1230099731, 797.4149, -3153.948, 5.911598); // Шлагбаум на выезд с южных доков
    object.delete(1230099731, 793.2574, -3157.738, 5.920921); // Шлагбаум на выезд с южных доков
    object.delete(1230099731, 788.4861, -3161.815, 5.924423); // Шлагбаум на выезд с южных доков
    object.delete(1230099731, 1095.464, -3333.108, 5.835983); // Шлагбаум на въезд с южных доков
    object.delete(1230099731, 1095.523, -3326.43, 5.835983); // Шлагбаум на въезд с южных доков
    object.delete(1230099731, 1095.532, -3320.142, 5.835983); // Шлагбаум на въезд с южных доков
    object.delete(1230099731, 1095.702, -3313.123, 5.849754); //Шлагбаум на въезд с южных доков

    // House 201
    object.delete(1295978393, 908.3832, -608.8929, 56.67847);
    object.delete(-248688364, 903.5204, -638.4057, 57.0828);
    object.delete(-199904194, 892.9502, -628.4284, 57.18616);
    object.delete(1948359883, 889.5828, -624.2993, 57.24658);
    object.delete(2796614321, 903.6192, 637.6093, 57.08246);
    object.delete(2796614321, 904.3519, 638.3322, 57.08072);
    
    object.delete(-1126237515, -821.8936, -1081.555, 10.13664); // Удалённый банкомат возле BINCO на каналах веспуччи

    // LSPD Vespucci
    object.delete(1369811908, -1083.034, -809.3999, 30.21146); // Воздухосборник на крыше
    object.delete(1369811908, -1081.318, -811.7222, 30.21146); // Воздухосборник на крыше
    object.delete(1369811908, -1070.896, -817.4315, 30.21146); // Воздухосборник на крыше
    object.delete(1369811908, -1069.18, -819.7538, 30.21146); // Воздухосборник на крыше

    // Столбики возле дверей в государственные офисы
    object.create(-994492850, new mp.Vector3(1838.105, 3670.664, 33.27806), new mp.Vector3(0, 0, 30.99991), false, false);// EMS|Sheriff Sandy Shores
    object.create(-994492850, new mp.Vector3(1839.35, 3671.394, 33.27798), new mp.Vector3(0, 0, 27.99991), false, false);// EMS|Sheriff Sandy Shores
    object.create(-994492850, new mp.Vector3(1840.611, 3672.125, 33.2782), new mp.Vector3(0, 0, 29.99988), false, false);// EMS|Sheriff Sandy Shores
    object.create(-994492850, new mp.Vector3(1841.846, 3672.826, 33.27814), new mp.Vector3(0, 0, 26.99986), false, false);// EMS|Sheriff Sandy Shores
    object.create(-994492850, new mp.Vector3(1857.097, 3681.638, 33.26824), new mp.Vector3(0, 0, 27.99987), false, false);// EMS|Sheriff Sandy Shores
    object.create(-994492850, new mp.Vector3(1822.152, 3662.325, 33.27676), new mp.Vector3(0, 0, 27.99987), false, false);// EMS|Sheriff Sandy Shores
    object.create(-994492850, new mp.Vector3(1821.534, 3663.4, 33.27676), new mp.Vector3(0, 0, 31.99986), false, false);// EMS|Sheriff Sandy Shores
    object.create(-994492850, new mp.Vector3(1856.261, 3706.938, 33.26958), new mp.Vector3(0, 0, 31.99986), false, false);// EMS|Sheriff Sandy Shores
    object.create(-994492850, new mp.Vector3(1837.482, 3696.075, 33.26939), new mp.Vector3(0, 0, 29.99983), false, false);// EMS|Sheriff Sandy Shores
    object.create(-994492850, new mp.Vector3(1855.819, 3680.898, 33.26824), new mp.Vector3(0, 0, 31.99982), false, false);// EMS|Sheriff Sandy Shores
    object.create(-994492850, new mp.Vector3(1855.152, 3706.314, 33.27112), new mp.Vector3(0, 0, 31.99986), false, false);// EMS|Sheriff Sandy Shores
    object.create(-994492850, new mp.Vector3(1836.203, 3695.357, 33.26764), new mp.Vector3(0, 0, 29.99983), false, false);// EMS|Sheriff Sandy Shores
    object.create(-994492850, new mp.Vector3(-379.5988, 6120.939, 30.47954), new mp.Vector3(0, 0, -41.99983), false, false);// BCFD Paleto Bay
    object.create(-994492850, new mp.Vector3(-380.9047, 6119.624, 30.47954), new mp.Vector3(0, 0, -45.9998), false, false);// BCFD Paleto Bay
    object.create(-994492850, new mp.Vector3(-382.3091, 6118.244, 30.47954), new mp.Vector3(0, 0, -42.99979), false, false);// BCFD Paleto Bay
    object.create(-994492850, new mp.Vector3(-378.1894, 6120.577, 30.47954), new mp.Vector3(0, 0, -41.9998), false, false);// BCFD Paleto Bay
    object.create(-994492850, new mp.Vector3(-381.8523, 6116.917, 30.47954), new mp.Vector3(0, 0, -44.99976), false, false);// BCFD Paleto Bay
    object.create(-994492850, new mp.Vector3(-236.3165, 6317.708, 30.50773), new mp.Vector3(0, 0, -42.99979), false, false);// EMS Paleto Bay
    object.create(-994492850, new mp.Vector3(-233.9889, 6320.019, 30.50628), new mp.Vector3(0, 0, -45.99974), false, false);// EMS Paleto Bay
    object.create(-994492850, new mp.Vector3(-235.1488, 6318.874, 30.50822), new mp.Vector3(0, 0, -43.99972), false, false);// EMS Paleto Bay
    object.create(-994492850, new mp.Vector3(-439.34, 6017.82, 30.49012), new mp.Vector3(0, 0, -42.99992), false, false);// Sheriff Paleto Bay
    object.create(-994492850, new mp.Vector3(-441.84, 6020.34, 30.49012), new mp.Vector3(0, 0, -46.9999), false, false);// Sheriff Paleto Bay
    object.create(-994492850, new mp.Vector3(-440.61, 6019.08, 30.49012), new mp.Vector3(0, 0, -46.99987), false, false);// Sheriff Paleto Bay
    object.create(-994492850, new mp.Vector3(-454.4348, 6006.975, 30.49012), new mp.Vector3(0, 0, -46.99981), false, false);// Sheriff Paleto Bay
    object.create(-994492850, new mp.Vector3(-453.3648, 6008.031, 30.49012), new mp.Vector3(0, 0, -46.9998), false, false);// Sheriff Paleto Bay
    object.create(-994492850, new mp.Vector3(-445.3816, 6000.079, 30.49012), new mp.Vector3(0, 0, -46.99977), false, false);// Sheriff Paleto Bay
    object.create(-994492850, new mp.Vector3(-446.4504, 5999.008, 30.49012), new mp.Vector3(0, 0, 43.00021), false, false);// Sheriff Paleto Bay
    object.create(-903362261, new mp.Vector3(-1082.703, -262.0022, 36.79493), new mp.Vector3(0, 0, 25.99997), false, false);// Life Invader
    object.create(-903362261, new mp.Vector3(-1080.106, -260.6477, 36.80637), new mp.Vector3(0, 0, 27.99996), false, false);// Life Invader
    object.create(-903362261, new mp.Vector3(-1081.396, -261.3129, 36.80052), new mp.Vector3(0, 0, 27.99996), false, false);// Life Invader
    object.create(-994492850, new mp.Vector3(-1041.645, -242.063, 36.84607), new mp.Vector3(0, 0, 25.9999), false, false);// Life Invader
    object.create(-994492850, new mp.Vector3(-1040.093, -241.2755, 36.84407), new mp.Vector3(0, 0, 27.99987), false, false);// Life Invader
    object.create(-903362261, new mp.Vector3(-1041.572, -222.8321, 36.78766), new mp.Vector3(0, 0, 27.99996), false, false);// Life Invader
    object.create(-903362261, new mp.Vector3(-1039.792, -222.0281, 36.76735), new mp.Vector3(0, 0, 113.9996), false, false);// Life Invader

    // USMC Интерьер
    object.create(262175156, new mp.Vector3(553.8767, -3121.37, 17.76858), new mp.Vector3(0, -5.008956E-06, -180), false, false);
    object.create(1555579420, new mp.Vector3(552.93, -3122.41, 17.76858), new mp.Vector3(5.008952E-06, -5.008947E-06, 89.99993), false, false);
    object.create(-1673752417, new mp.Vector3(558.94, -3127, 17.76858), new mp.Vector3(-6.361109E-14, -5.008956E-06, -89.99986), false, false);
    object.create(1555579420, new mp.Vector3(559.96, -3127.91, 17.76858), new mp.Vector3(-1.068666E-11, -5.008944E-06, -179.9996), false, false);
    object.create(262175156, new mp.Vector3(553.9117, -3123.43, 17.76858), new mp.Vector3(0, -5.008956E-06, -180), false, false);
    object.create(1555579420, new mp.Vector3(552.93, -3124.46, 17.76858), new mp.Vector3(5.008952E-06, -5.008944E-06, 89.99989), false, false);
    object.create(262175156, new mp.Vector3(553.9, -3125.48, 17.76858), new mp.Vector3(0, -5.008956E-06, -180), false, false);
    object.create(1555579420, new mp.Vector3(552.93, -3126.49, 17.76858), new mp.Vector3(5.008952E-06, -5.008939E-06, 89.99985), false, false);
    object.create(262175156, new mp.Vector3(553.9, -3127.54, 17.76858), new mp.Vector3(0, -5.008956E-06, -180), false, false);
    object.create(992069095, new mp.Vector3(572.2, -3116.28, 18.72), new mp.Vector3(0, 0, 0), false, false);
    object.create(-654402915, new mp.Vector3(571.18, -3116.32, 18.68), new mp.Vector3(0, 0, 0), false, false);
    object.create(690372739, new mp.Vector3(570.32, -3116.13, 17.76835), new mp.Vector3(0, 0, 0), false, false);
    object.create(73774428, new mp.Vector3(566.7965, -3116.079, 19.12073), new mp.Vector3(0, 0, 0), false, false);
    object.create(1442760350, new mp.Vector3(572.9116, -3119.277, 18.36), new mp.Vector3(0, 0, 179.9997), false, false);
    object.create(1442760350, new mp.Vector3(565.43, -3119.331, 18.36), new mp.Vector3(0, 0, 179.9997), false, false);
    object.create(-1122944124, new mp.Vector3(552.8477, -3122.45, 18.55), new mp.Vector3(0, 0, 130.0003), false, false);
    object.create(144995201, new mp.Vector3(552.9262, -3124.703, 18.55032), new mp.Vector3(0, 0, -85.99991), false, false);
    object.create(144995201, new mp.Vector3(552.8672, -3126.672, 18.55032), new mp.Vector3(0, 0, 83.99995), false, false);
    object.create(-1321253704, new mp.Vector3(558.1534, -3128.107, 18.55032), new mp.Vector3(0, 0, -131.9999), false, false);
    object.create(-364924791, new mp.Vector3(555.75, -3127.97, 18.69), new mp.Vector3(0, 0, 129), false, false);
    object.create(2000514109, new mp.Vector3(581.4695, -3126.904, 17.76858), new mp.Vector3(0, 0, 0), false, false);
    object.create(-1626066319, new mp.Vector3(577.2021, -3127.662, 18.35), new mp.Vector3(1.001791E-05, -5.008955E-06, 116.7496), false, false);
    object.create(-870868698, new mp.Vector3(585.34, -3119.4, 17.76858), new mp.Vector3(-2.564906E-12, -5.008952E-06, -89.99995), false, false);
    object.create(1335593994, new mp.Vector3(583.5229, -3128.229, 19.31016), new mp.Vector3(0, 0, -179.9998), false, false);
    object.create(2120805012, new mp.Vector3(583, -3122.6, 22.46), new mp.Vector3(0, 0, 0), false, false);
    object.create(2120805012, new mp.Vector3(579, -3125.75, 22.46), new mp.Vector3(0, 0, 0), false, false);
    object.create(2120805012, new mp.Vector3(583, -3125.75, 22.46), new mp.Vector3(0, 0, 0), false, false);
    object.create(2120805012, new mp.Vector3(579, -3122.6, 22.46), new mp.Vector3(0, 0, 0), false, false);
    object.create(2120805012, new mp.Vector3(554.6, -3124.2, 22.1), new mp.Vector3(0, 0, 0), false, false);
    object.create(2120805012, new mp.Vector3(559.43, -3124.2, 22.1), new mp.Vector3(0, 0, 0), false, false);
    object.create(1430014549, new mp.Vector3(585.3341, -3127.949, 17.76858), new mp.Vector3(0, 0, -90.99976), false, false);
    object.create(960293494, new mp.Vector3(584.24, -3120.25, 18.24), new mp.Vector3(0, 0, 0), false, false);
    object.create(960293494, new mp.Vector3(578.62, -3120.25, 18.24), new mp.Vector3(0, 0, 0), false, false);
    object.create(960293494, new mp.Vector3(584.24, -3121.5, 18.24), new mp.Vector3(0, 0, 0), false, false);
    object.create(960293494, new mp.Vector3(584.24, -3122.75, 18.24), new mp.Vector3(0, 0, 0), false, false);
    object.create(960293494, new mp.Vector3(584.24, -3124, 18.24), new mp.Vector3(0, 0, 0), false, false);
    object.create(960293494, new mp.Vector3(578.62, -3121.5, 18.24), new mp.Vector3(0, 0, 0), false, false);
    object.create(960293494, new mp.Vector3(578.62, -3122.75, 18.24), new mp.Vector3(0, 0, 0), false, false);
    object.create(960293494, new mp.Vector3(578.62, -3124, 18.24), new mp.Vector3(0, 0, 0), false, false);
    object.create(960293494, new mp.Vector3(584.24, -3125.25, 18.24), new mp.Vector3(0, 0, 0), false, false);
    object.create(992647982, new mp.Vector3(577.79, -3126.3, 18.44), new mp.Vector3(0, 0, 8.761881E-05), false, false);
    object.create(1442760350, new mp.Vector3(558.73, -3116.395, 18.36), new mp.Vector3(0, 0, -7.122754E-05), false, false);
    object.create(1920075387, new mp.Vector3(568.77, -3117.76, 21.18), new mp.Vector3(0, 0, -89.9997), false, false);
    object.create(1920075387, new mp.Vector3(579.36, -3117.77, 21.18), new mp.Vector3(0, 0, -89.9997), false, false);
    object.create(1920075387, new mp.Vector3(558.64, -3117.76, 21.18), new mp.Vector3(0, 0, -89.99968), false, false);
    object.create(-1798470109, new mp.Vector3(561.67, -3120.7, 17.76858), new mp.Vector3(0, 0, 0), false, false);
    object.create(-1798470109, new mp.Vector3(560.8, -3120.71, 17.76858), new mp.Vector3(0, 0, 0), false, false);
    object.create(-1673752417, new mp.Vector3(561, -3127, 17.76858), new mp.Vector3(6.781585E-13, -5.008956E-06, -89.99986), false, false);
    object.create(1555579420, new mp.Vector3(557.89, -3127.91, 17.76858), new mp.Vector3(-1.068667E-11, -5.008943E-06, -179.9996), false, false);
    object.create(-1673752417, new mp.Vector3(556.85, -3127.021, 17.76858), new mp.Vector3(6.781585E-13, -5.008956E-06, -89.99986), false, false);
    object.create(1555579420, new mp.Vector3(555.86, -3127.91, 17.76858), new mp.Vector3(-1.068667E-11, -5.008943E-06, -179.9996), false, false);
    object.create(1555579420, new mp.Vector3(552.93, -3120.34, 17.76858), new mp.Vector3(5.008952E-06, -5.008944E-06, 89.99989), false, false);
    object.create(-2019599437, new mp.Vector3(560.83, -3123.593, 17.76858), new mp.Vector3(0, 0, 0), false, false);
    object.create(558578166, new mp.Vector3(561.2051, -3122.811, 18.29), new mp.Vector3(2.137333E-12, 5.008956E-06, -79.99993), false, false);
    object.create(558578166, new mp.Vector3(561.1328, -3124.909, 18.29), new mp.Vector3(8.447553E-12, 5.008957E-06, -164.9996), false, false);
    object.create(558578166, new mp.Vector3(559.0146, -3123.697, 18.29), new mp.Vector3(4.681776E-12, -5.008956E-06, 98.75004), false, false);
    object.create(1862437453, new mp.Vector3(561.4973, -3123.669, 18.57), new mp.Vector3(0, 0, -69.99992), false, false);
    object.create(-331509782, new mp.Vector3(561.469, -3123.36, 18.58), new mp.Vector3(0, 0, 14.99996), false, false);
    object.create(-331509782, new mp.Vector3(561.399, -3123.83, 18.58), new mp.Vector3(1.00179E-05, 5.008956E-06, -58.82504), false, false);
    object.create(-331509782, new mp.Vector3(560.2056, -3123.82, 18.58), new mp.Vector3(1.001787E-05, -5.008957E-06, -138.7498), false, false);
    object.create(1503218008, new mp.Vector3(560.61, -3121.21, 22.14), new mp.Vector3(0, 0, -24.99992), false, false);
    object.create(2057223314, new mp.Vector3(560.7354, -3128.383, 18.72), new mp.Vector3(1.001785E-05, 5.008956E-06, -174.9995), false, false);
    object.create(900603612, new mp.Vector3(559.39, -3121.256, 17.76), new mp.Vector3(0, 0, -0.9999992), false, false);
    object.create(2065988552, new mp.Vector3(560.6711, -3126.15, 17.85), new mp.Vector3(0, 0, -90.99977), false, false);
    object.create(-1309218480, new mp.Vector3(560.6645, -3126.305, 17.85), new mp.Vector3(0, 0, -94.99992), false, false);
    object.create(1175177969, new mp.Vector3(560.1104, -3127.812, 18.57), new mp.Vector3(0, 0, -144.9998), false, false);
    object.create(1172780765, new mp.Vector3(552.7939, -3120.093, 18.7), new mp.Vector3(0, 0, -96.99976), false, false);
    object.create(622622020, new mp.Vector3(552.79, -3120.15, 18.71), new mp.Vector3(0, 0, -95.99969), false, false);
    object.create(459560200, new mp.Vector3(552.7916, -3120.233, 18.64), new mp.Vector3(0, 0, -148.9996), false, false);
    object.create(921231391, new mp.Vector3(556.0608, -3128.103, 18.55032), new mp.Vector3(0, 0, -28.99998), false, false);
    object.create(-502024136, new mp.Vector3(552.7591, -3120.38, 18.55032), new mp.Vector3(0, 0, 64.99992), false, false);
    object.create(-502024136, new mp.Vector3(555.9631, -3128.006, 18.55032), new mp.Vector3(0, 0, -167.0001), false, false);
    object.create(-1540767983, new mp.Vector3(552.9484, -3126.438, 18.55032), new mp.Vector3(0, 0, 83.00039), false, false);
    object.create(-2042781782, new mp.Vector3(552.9125, -3124.321, 18.55032), new mp.Vector3(0, 0, 106.9997), false, false);
    object.create(210172640, new mp.Vector3(553.0473, -3120.152, 18.6), new mp.Vector3(0, 0, 10.00001), false, false);
    object.create(684271492, new mp.Vector3(559.3544, -3120.291, 20.56), new mp.Vector3(0, 0, -24.99995), false, false);
    object.create(-1989035681, new mp.Vector3(557.9535, -3128.02, 18.6), new mp.Vector3(0, 0, 168.9992), false, false);
    object.create(920122288, new mp.Vector3(559.9868, -3128.03, 18.55032), new mp.Vector3(0, 0, -16.99995), false, false);
    object.create(920122288, new mp.Vector3(552.7494, -3122.618, 18.55032), new mp.Vector3(0, 0, -75.99982), false, false);
    object.create(588223318, new mp.Vector3(559.7552, -3128.07, 18.55032), new mp.Vector3(0, 0, -73.99986), false, false);
    object.create(498625049, new mp.Vector3(552.9611, -3122.176, 18.55032), new mp.Vector3(0, 0, -9.999918), false, false);
    object.create(99079546, new mp.Vector3(557.68, -3128.075, 18.55032), new mp.Vector3(0, 0, 5.999993), false, false);
    object.create(-1052198219, new mp.Vector3(561.6778, -3123.337, 18.78546), new mp.Vector3(0, 0, -90.99958), false, false);
    object.create(-2036081975, new mp.Vector3(561.431, -3123.475, 18.53), new mp.Vector3(0, 0, 69.99995), false, false);
    object.create(865260220, new mp.Vector3(552.91, -3126.75, 17.8), new mp.Vector3(0, 0, 168), false, false);
    object.create(-755359081, new mp.Vector3(560.257, -3128.358, 18.85), new mp.Vector3(0, 0, -60.99997), false, false);
    object.create(714696561, new mp.Vector3(553.0664, -3122.366, 18.56), new mp.Vector3(0, 0, 74.99995), false, false);
    object.create(-2015151925, new mp.Vector3(552.64, -3122.4, 20), new mp.Vector3(0, 0, 89.99995), false, false);
    object.create(1858249839, new mp.Vector3(552.64, -3125.67, 20), new mp.Vector3(0, 0, 89.99936), false, false);
    object.create(1430014549, new mp.Vector3(558.483, -3120.281, 17.76858), new mp.Vector3(0, 0, -89.99982), false, false);

    object.delete(-686494084, 553.3941, -3125.841, 17.76001);
    object.delete(-686494084, 553.3941, -3122.123, 17.76001);
    object.delete(153748523, 562.7704, -3116.958, 17.76855);
    object.delete(153748523, 560.4883, -3116.958, 17.76855);
    object.delete(-1322183878, 564.8561, -3116.698, 17.76855);
    object.delete(-1322183878, 567.0126, -3116.674, 17.76855);
    object.delete(-1601152168, 572.3345, -3116.448, 17.77534);
    object.delete(1268458364, 571.1268, -3124.192, 17.82297);
    object.delete(1268458364, 565.9408, -3124.159, 17.82297);
    object.delete(1268458364, 565.7878, -3121.352, 17.82297);
    object.delete(1268458364, 563.0634, -3124.885, 17.82297);
    object.delete(1268458364, 570.1364, -3126.957, 17.82297);
    object.delete(1268458364, 573.5175, -3123.579, 17.82297);

    // USMC удалённые объекты
    object.delete(-1186441238, 494.1839, -3172.116, 5.878304);
    object.delete(-1951881617, 494.6395, -3169.479, 5.75782);
    object.delete(-573669520, 495.6996, -3171.674, 5.07093);
    object.delete(-2111846380, 495.6094, -3173.289, 5.07093);
    object.delete(-531344027, 475.8765, -3319.167, 5.089127);
    object.delete(1152297372, 475.0235, -3346.202, 5.068886);
    object.delete(1836351583, 463.7339, -3266.296, 5.078712);
    object.delete(1836351583, 463.7339, -3263.243, 5.07872);
    object.delete(2111998691, 500.2244, -3122.565, 5.71804);
    object.delete(-1654693836, 466.6028, -3135.002, 4.996956);
    object.delete(2111998691, 461.2262, -3162.616, 10.23563);
    object.delete(-1951881617, 461.0514, -3164.422, 8.911934);
    object.delete(2111998691, 461.2427, -3159.356, 9.557152);
    object.delete(-1203351544, 556.4871, -3123.387, 5.357643);
    object.delete(-2129526670, 589.6744, -3118.055, 5.075378);
    object.delete(1935071027, 601.1582, -3127.663, 5.068657);
    object.delete(1935071027, 600.8398, -3125.627, 5.068657);
    object.delete(-2129526670, 604.8365, -3064.079, 5.07106);
    object.delete(895484294, 571.9683, -3113.014, 5.072784);
    object.delete(2111998691, 573.4853, -3108.084, 5.724648);
    object.delete(282166596, 587.3837, -3276.391, 5.070946);
    object.delete(-566369276, 587.7123, -3278.891, 5.072769);
    object.delete(-340374416, 587.4498, -3279.972, 5.075462);
    object.delete(282166596, 591.8303, -3274.416, 5.064537);
    object.delete(631304913, 592.6569, -3274.107, 5.055557);
    object.delete(1270590574, 592.9635, -3283.756, 5.45787);
    object.delete(1257553220, 592.593, -3283.774, 5.07579);
    object.delete(-672016228, 592.3896, -3284.011, 5.075127);
    object.delete(936543891, 589.9376, -3283.306, 5.190025);
    object.delete(1242409737, 589.1798, -3283.458, 5.134148);
    object.delete(1257553220, 587.2144, -3284.656, 5.068756);
    object.delete(-371004270, 592.3483, -3277.81, 6.921242);
    object.delete(1824078756, 593.0121, -3281.072, 6.915886);
    object.delete(-1422265815, 592.7902, -3280.429, 5.134003);
    object.delete(1268458364, 571.1268, -3124.192, 17.82297);
    object.delete(1268458364, 573.5175, -3123.579, 17.82297);
    object.delete(1268458364, 565.9408, -3124.159, 17.82297);
    object.delete(1268458364, 563.0634, -3124.885, 17.82297);
    object.delete(-566369276, 507.6625, -3121.806, 5.071198);
    object.delete(-1894042373, 549.28, -3119.161, 5.072136);
    object.delete(-191836989, 582.6382, -3115.977, 5.07029);
    object.delete(904554844, 581.5203, -3113.154, 5.068436);
    object.delete(904554844, 581.5203, -3110.815, 5.068436);
    object.delete(96868307, 484.2535, -3110.429, 5.336838);
    object.delete(-1601152168, 572.3345, -3116.448, 17.77534);
    object.delete(-1322183878, 567.0126, -3116.674, 17.76855);
    object.delete(1268458364, 565.7878, -3121.352, 17.82297);
    object.delete(-1322183878, 564.8561, -3116.698, 17.76855);
    object.delete(153748523, 562.7704, -3116.958, 17.76855);
    object.delete(153748523, 560.4883, -3116.958, 17.76855);
    object.delete(-686494084, 553.3941, -3125.841, 17.76001);
    object.delete(-686494084, 553.3941, -3122.123, 17.76001);
    object.delete(-1286880215, 469.0038, -3019.467, 4.994148);
    object.delete(-1286880215, 471.5793, -3028.548, 5.079987);
    object.delete(-995793124, 444.4001, -3050.43, 5.065559);
    object.delete(2069078066, 447.3075, -3050.013, 5.066895);
    object.delete(-1249123711, 606.989, -3219.699, 5.516487);
    object.delete(757019157, 597.2918, -3292.438, 5.197281);
    object.delete(-316280517, 592.7982, -3286.743, 6.160912);
    object.delete(-921781850, 587.4191, -3286.951, 5.070274);
    object.delete(830159341, 490.6992, -3389.444, 5.447319);
    object.delete(757019157, 467.8865, -3384.7, 5.178558);
    object.delete(1268458364, 570.1364, -3126.957, 17.82297);
    object.delete(415536433, 442.2275, -3020.884, 5.076187);
    object.delete(-46303329, 461.049, -3147.45, 5.075378);
    object.delete(364445978, 445.5908, -3037.615, 5.070641);
    object.delete(3440696416, 569.093, -3199.545, -3.183331);
    object.delete(3440696416, 559.9204, -3206.241, 1.2113);

// Stock 75 (Склад)
    object.delete(1605769687, 1014.959, -1870.687, 29.86173);
    object.delete(666561306, 1013, -1869.589, 29.89331);
    object.delete(218085040, 1012.922, -1871.677, 29.8933);
    object.delete(1605769687, 1019.028, -1870.899, 29.87857);
    object.delete(1605769687, 1025.969, -1854.496, 29.87857);

    // Stock 73 (Склад)
    object.delete(666561306, 909.3621, -1796.512, 29.61789);
    object.delete(-1186441238, 908.9841, -1812.387, 29.64365);
    object.delete(-1186441238, 906.8782, -1815.909, 29.64603);

// Respawn Vagos
    object.delete(1120812170, 464.8118, -1878.996, 25.88975);
    object.delete(1120812170, 460.934, -1879.938, 25.86355);

// Respawn Families
    object.delete(666561306, 0.376709, -1824.403, 24.36003);
    object.delete(666561306, 1.928772, -1822.495, 24.35666);

// Respawn Ballas
    object.delete(388197031, -175.7925, -1729.39, 29.51634);
    object.delete(388197031, -213.5844, -1718.681, 31.68086);

// Respawn Marabunta
    object.delete(666561306, 1318.073, -1670.691, 50.23988);
    object.delete(218085040, 1316.676, -1672.521, 50.23988);
    object.delete(666561306, 1315.009, -1673.674, 50.23988);
    object.delete(1369811908, 1332.215, -1652.59, 56.43007);
    object.delete(1369811908, 1329.432, -1648.819, 56.43007);
    object.delete(-2129526670, 1342.168, -1649.839, 52.03609);

    // Интерьер Maze Bank Arena
    object.create(1566872341, new mp.Vector3(-252.0165, -2002.122, 29.6), new mp.Vector3(0, 0, -15.59995), false, false);
    object.create(-219578277, new mp.Vector3(-252.43, -2001.81, 29.9), new mp.Vector3(1.001791E-05, 5.008957E-06, -47.99999), false, false);
    object.create(-4948487, new mp.Vector3(-251.5906, -2002.142, 29.875), new mp.Vector3(0, 0, -159.3997), false, false);
    object.create(1152367621, new mp.Vector3(-252.0588, -2002.212, 29.8819), new mp.Vector3(0, 0, -25.99998), false, false);
    object.create(-1814932629, new mp.Vector3(-252.0211, -2002.322, 29.8819), new mp.Vector3(0, 0, -52.99994), false, false);
    object.create(-297480469, new mp.Vector3(-252.2355, -2001.898, 29.8819), new mp.Vector3(0, 0, 140.9996), false, false);
    object.create(-870868698, new mp.Vector3(-258.2263, -2003.512, 29.14564), new mp.Vector3(0, 0, 73.69981), false, false);
    object.create(-870868698, new mp.Vector3(-262.8799, -2013.098, 29.14559), new mp.Vector3(0, 0, 51.59959), false, false);
    object.create(-870868698, new mp.Vector3(-272.8145, -2023.988, 29.14559), new mp.Vector3(0, 0, 36.89944), false, false);
    object.create(144995201, new mp.Vector3(-251.3681, -2001.986, 29.8819), new mp.Vector3(0, 0, -55.99997), false, false);
    object.create(-1510803822, new mp.Vector3(-248.836, -2021.721, 28.94604), new mp.Vector3(0, 0, -40.19993), false, false);
    object.create(-1510803822, new mp.Vector3(-250.8559, -2024.124, 28.94604), new mp.Vector3(0, 0, -40.19996), false, false);
    object.create(-1510803822, new mp.Vector3(-251.765, -2025.206, 28.94604), new mp.Vector3(0, 0, -40.19996), false, false);
    object.create(-1510803822, new mp.Vector3(-249.7391, -2022.783, 28.94604), new mp.Vector3(0, 0, -38.99994), false, false);
    object.create(-1510803822, new mp.Vector3(-252.8401, -2026.481, 28.94604), new mp.Vector3(0, 0, -40.19996), false, false);
    object.create(-1510803822, new mp.Vector3(-254.8995, -2028.932, 28.94604), new mp.Vector3(0, 0, -40.19996), false, false);
    object.create(-1510803822, new mp.Vector3(-253.8613, -2027.697, 28.94604), new mp.Vector3(0, 0, -40.19996), false, false);
    object.create(-1510803822, new mp.Vector3(-255.9588, -2030.205, 28.94604), new mp.Vector3(0, 0, -40.19996), false, false);
    object.create(-1510803822, new mp.Vector3(-258.904, -2033.69, 28.94604), new mp.Vector3(0, 0, -40.19996), false, false);
    object.create(-1510803822, new mp.Vector3(-258.0022, -2032.617, 28.94604), new mp.Vector3(0, 0, -40.19996), false, false);
    object.create(-1510803822, new mp.Vector3(-256.8669, -2031.278, 28.94604), new mp.Vector3(0, 0, -40.19996), false, false);
    object.create(446117594, new mp.Vector3(-252.6071, -2002.094, 29.8819), new mp.Vector3(0, 0, 18.99996), false, false);
    object.create(419741070, new mp.Vector3(-251.5574, -2002.397, 29.8819), new mp.Vector3(0, 0, -35.99998), false, false);

    object.delete(-1126237515, -262.3608, -2012.054, 29.16964);
    object.delete(-1126237515, -273.3665, -2024.208, 29.16964);

    // DN_Str_PillboxHill3lvl
    object.create(667319138, new mp.Vector3(-152.5572, -973.0461, 268.1352), new mp.Vector3(0, 0, 70.00006), false, false);
    object.create(667319138, new mp.Vector3(-143.19, -946.334, 263.1339), new mp.Vector3(1.017777E-13, -5.008956E-06, 160), false, false);
    object.create(667319138, new mp.Vector3(-143.962, -972.4, 263.1339), new mp.Vector3(5.008956E-06, -5.008956E-06, -110), false, false);
    object.create(667319138, new mp.Vector3(-143.3905, -957.8922, 263.1339), new mp.Vector3(5.008956E-06, 2.23118E-05, -19.99993), false, false);
    object.create(667319138, new mp.Vector3(-156.8549, -969.8695, 263.1339), new mp.Vector3(0, 0, 70.00006), false, false);
    object.create(667319138, new mp.Vector3(-144.7658, -961.6576, 263.1339), new mp.Vector3(5.008957E-06, 2.231179E-05, -19.99993), false, false);
    object.create(667319138, new mp.Vector3(-153.0588, -971.2097, 263.1339), new mp.Vector3(0, 0, 70.00006), false, false);
    object.create(667319138, new mp.Vector3(-144.5686, -950.0627, 263.1339), new mp.Vector3(1.017777E-13, -5.008956E-06, 160), false, false);
    object.create(667319138, new mp.Vector3(-138.5923, -957.2554, 258.1327), new mp.Vector3(0, 0, 70.00006), false, false);
    object.create(667319138, new mp.Vector3(-150.9606, -972.0338, 258.1327), new mp.Vector3(0, 0, 70.00006), false, false);
    object.create(667319138, new mp.Vector3(-154.7041, -970.6662, 258.1327), new mp.Vector3(0, 0, 70.00006), false, false);
    object.create(667319138, new mp.Vector3(-145.4599, -969.4404, 258.1327), new mp.Vector3(1.017777E-13, -5.008956E-06, 160), false, false);
    object.create(667319138, new mp.Vector3(-144.0922, -965.6717, 258.1327), new mp.Vector3(1.017777E-13, -5.008956E-06, 160), false, false);
    object.create(667319138, new mp.Vector3(-144.8888, -955.1929, 258.1327), new mp.Vector3(5.008956E-06, -5.008956E-06, -110), false, false);
    object.create(667319138, new mp.Vector3(-148.66, -953.8333, 258.1327), new mp.Vector3(5.008956E-06, -5.008956E-06, -110), false, false);
    object.create(667319138, new mp.Vector3(-150.3224, -970.1055, 253.1315), new mp.Vector3(5.008956E-06, -5.008956E-06, -110), false, false);
    object.create(667319138, new mp.Vector3(-154.0854, -968.7345, 253.1315), new mp.Vector3(5.008956E-06, -5.008956E-06, -110), false, false);
    object.create(667319138, new mp.Vector3(-151.991, -947.6589, 253.1315), new mp.Vector3(5.008958E-06, 2.231179E-05, -19.99993), false, false);
    object.create(667319138, new mp.Vector3(-150.6315, -943.8949, 253.1315), new mp.Vector3(5.008957E-06, 2.231179E-05, -19.99993), false, false);
    object.create(667319138, new mp.Vector3(-144.15, -953.0117, 253.1315), new mp.Vector3(5.008956E-06, -5.008956E-06, -110), false, false);
    object.create(667319138, new mp.Vector3(-150.4627, -950.6902, 253.1315), new mp.Vector3(5.008956E-06, -5.008956E-06, -110), false, false);
    object.create(667319138, new mp.Vector3(-144.1992, -965.0032, 253.1315), new mp.Vector3(0, 0, 70.00006), false, false);
    object.create(1962326206, new mp.Vector3(-156.7062, -946.9736, 268.1352), new mp.Vector3(0, 0, 170.0938), false, false);
    object.create(1962326206, new mp.Vector3(-155.5352, -943.3564, 268.1352), new mp.Vector3(0, 0, 155.0936), false, false);
    object.create(1962326206, new mp.Vector3(-154.018, -939.8267, 268.1352), new mp.Vector3(0, 0, 175.0933), false, false);
    object.create(-1672689514, new mp.Vector3(-152.0229, -940.0406, 268.1352), new mp.Vector3(0, 0, -24.90299), false, false);
    object.create(-1672689514, new mp.Vector3(-157.3094, -949.0589, 268.1352), new mp.Vector3(0, 0, 67.09671), false, false);
    object.create(-1951226014, new mp.Vector3(-180.8983, -1012.624, 113.1366), new mp.Vector3(0, 0, -19.90606), false, false);
    object.create(1867879106, new mp.Vector3(-146.6705, -998.3036, 253.1315), new mp.Vector3(0, 0, 86.99982), false, false);
    object.create(1867879106, new mp.Vector3(-147.8969, -984.6796, 258.2299), new mp.Vector3(0, 0, -108.8), false, false);
    object.create(1867879106, new mp.Vector3(-147.8204, -984.5305, 263.271), new mp.Vector3(0, 0, -108.8), false, false);
    object.create(1867879106, new mp.Vector3(-142.182, -982.5738, 268.2377), new mp.Vector3(0, 0, 114.1999), false, false);
    object.create(1867879106, new mp.Vector3(-150.9086, -941.5202, 268.1352), new mp.Vector3(0, 0, -171.7998), false, false);

// DN_Str_PillboxHill2lvl
    object.create(-1951881617, new mp.Vector3(-155.4206, -943.4492, 113.1366), new mp.Vector3(0, 0, -110.9059), false, false);
    object.create(-1951226014, new mp.Vector3(-180.8983, -1012.624, 113.1366), new mp.Vector3(0, 0, -19.90606), false, false);
    object.create(1867879106, new mp.Vector3(-142.182, -982.5738, 268.2377), new mp.Vector3(0, 0, 114.1999), false, false);
    object.create(1867879106, new mp.Vector3(-147.144, -942.1729, 113.1366), new mp.Vector3(0, 0, 172.2002), false, false);
    object.create(1867879106, new mp.Vector3(-144.0376, -963.011, 113.1366), new mp.Vector3(0, 0, 130.1999), false, false);
    object.create(1867879106, new mp.Vector3(-150.4479, -984.6939, 113.1366), new mp.Vector3(0, 0, -94.79984), false, false);
    object.create(1867879106, new mp.Vector3(-153.0053, -1006.198, 113.1366), new mp.Vector3(0, 0, 168.2001), false, false);
    object.create(1867879106, new mp.Vector3(-177.496, -997.6606, 113.1366), new mp.Vector3(0, 0, -119.7997), false, false);
    object.create(1867879106, new mp.Vector3(-160.1077, -971.1824, 113.1366), new mp.Vector3(0, 0, 17.20038), false, false);

// DN_Str_MirrorParkH1
    object.create(-226179982, new mp.Vector3(1042.26, -407.24, 65.31), new mp.Vector3(0, 0, 38.62275), false, false);
    object.create(-519102073, new mp.Vector3(1047.27, -403.32, 67.44314), new mp.Vector3(0, 0, 36.94094), false, false);
    object.create(-226179982, new mp.Vector3(1053.1, -397.95, 65.85), new mp.Vector3(0, 0, 38.63196), false, false);

// DN_Str_MirrorParkH2
    object.create(-226179982, new mp.Vector3(935.19, -569.13, 57.06), new mp.Vector3(0.3827626, -2.589476, 28.05701), false, false);
    object.create(-226179982, new mp.Vector3(947.68, -562.55, 57.6), new mp.Vector3(0.3830457, -1.227683, 28.04785), false, false);

// DN_Str_MirrorParkH3
    object.create(-226179982, new mp.Vector3(1203.43, -649.6365, 61.08), new mp.Vector3(0.3822106, 3.968742, -78.31068), false, false);
    object.create(-519102073, new mp.Vector3(1201.87, -642.01, 63.49965), new mp.Vector3(0.3365203, 1.909038, -80.00754), false, false);
    object.create(-226179982, new mp.Vector3(1200.6, -635.64, 61.84719), new mp.Vector3(0.3826369, 2.895059, -78.30347), false, false);

// DN_Str_AltaS
    object.create(309416120, new mp.Vector3(15.74857, -424.2195, 44.56396), new mp.Vector3(-4.07111E-13, -5.008956E-06, 70.00001), false, false);
    object.create(309416120, new mp.Vector3(44.91493, -392.0058, 44.56373), new mp.Vector3(5.008954E-06, 2.23118E-05, -110), false, false);
    object.create(309416120, new mp.Vector3(28.58949, -426.7583, 44.56396), new mp.Vector3(-4.46236E-05, 2.23118E-05, -20), false, false);
    object.create(309416120, new mp.Vector3(53.13667, -379.223, 44.56424), new mp.Vector3(-4.462359E-05, -6.329292E-05, 160), false, false);
    object.create(309416120, new mp.Vector3(53.77081, -379.3014, 63.80591), new mp.Vector3(-4.462359E-05, -6.329292E-05, 160), false, false);
    object.create(309416120, new mp.Vector3(31.95427, -381.9546, 54.28927), new mp.Vector3(5.008954E-06, 2.23118E-05, -110), false, false);
    object.create(309416120, new mp.Vector3(38.47226, -373.7392, 54.28927), new mp.Vector3(-4.46236E-05, 2.23118E-05, -20), false, false);
    object.create(309416120, new mp.Vector3(32.2823, -380.6179, 63.80509), new mp.Vector3(-4.07111E-13, -5.008956E-06, 70.00001), false, false);
    object.create(309416120, new mp.Vector3(35.71803, -438.1096, 54.28996), new mp.Vector3(-4.07111E-13, -5.008956E-06, 70.00001), false, false);
    object.create(309416120, new mp.Vector3(25.27581, -446.699, 54.28996), new mp.Vector3(-4.462359E-05, -6.329292E-05, 160), false, false);
    object.create(309416120, new mp.Vector3(28.18129, -438.702, 64.035), new mp.Vector3(5.008954E-06, 2.23118E-05, -110), false, false);
    object.create(309416120, new mp.Vector3(30.57405, -444.622, 64.035), new mp.Vector3(-4.46236E-05, 2.23118E-05, -20), false, false);
    object.create(309416120, new mp.Vector3(28.20287, -448.1382, 72.98136), new mp.Vector3(-4.462359E-05, -6.329292E-05, 160), false, false);
    object.create(309416120, new mp.Vector3(32.83206, -388.4723, 72.94795), new mp.Vector3(-4.07111E-13, -5.008956E-06, 70.00001), false, false);
    object.create(1867879106, new mp.Vector3(35.09442, -438.6052, 73.19566), new mp.Vector3(0, 0, 154.6997), false, false);
    object.create(1867879106, new mp.Vector3(26.50756, -434.6695, 64.035), new mp.Vector3(0, 0, -124.0002), false, false);
    object.create(1867879106, new mp.Vector3(27.01027, -419.4724, 54.28996), new mp.Vector3(0, 0, 10.50007), false, false);
    object.create(1867879106, new mp.Vector3(49.02978, -418.225, 44.50563), new mp.Vector3(0, 0, -102.9996), false, false);
    object.create(1867879106, new mp.Vector3(42.49611, -402.7191, 54.28996), new mp.Vector3(0, 0, -35.2995), false, false);
    object.create(1867879106, new mp.Vector3(53.83488, -399.106, 63.80647), new mp.Vector3(0, 0, 49.0004), false, false);
    object.create(1867879106, new mp.Vector3(53.5691, -402.9681, 72.94704), new mp.Vector3(0, 0, 55.9003), false, false);
    object.create(-250952474, new mp.Vector3(47.52, -420.46, 71.93), new mp.Vector3(-2.75007, -5.021702E-06, -20.09997), false, false);

// DN_Str_AltaN
    object.create(309416120, new mp.Vector3(31.95427, -381.9546, 54.28927), new mp.Vector3(5.008954E-06, 2.23118E-05, -110), false, false);
    object.create(309416120, new mp.Vector3(38.47226, -373.7392, 54.28927), new mp.Vector3(-4.46236E-05, 2.23118E-05, -20), false, false);
    object.create(309416120, new mp.Vector3(35.71803, -438.1096, 54.28996), new mp.Vector3(-4.07111E-13, -5.008956E-06, 70.00001), false, false);
    object.create(309416120, new mp.Vector3(25.27581, -446.699, 54.28996), new mp.Vector3(-4.462359E-05, -6.329292E-05, 160), false, false);
    object.create(309416120, new mp.Vector3(107.0913, -369.3398, 54.50181), new mp.Vector3(5.008954E-06, 2.23118E-05, -110), false, false);
    object.create(309416120, new mp.Vector3(80.43315, -330.5084, 54.51336), new mp.Vector3(-4.46236E-05, 2.23118E-05, -20), false, false);
    object.create(309416120, new mp.Vector3(65.97516, -345.7104, 54.51337), new mp.Vector3(-4.462359E-05, -6.329292E-05, 160), false, false);
    object.create(309416120, new mp.Vector3(110.1771, -358.349, 54.50181), new mp.Vector3(-4.07111E-13, -5.008956E-06, 70.00001), false, false);
    object.create(309416120, new mp.Vector3(67.98327, -331.9595, 66.20216), new mp.Vector3(-4.07111E-13, -5.008956E-06, 70.00001), false, false);
    object.create(309416120, new mp.Vector3(109.7264, -364.213, 66.31776), new mp.Vector3(5.008954E-06, 2.23118E-05, -110), false, false);
    object.create(309416120, new mp.Vector3(66.5659, -344.9088, 66.20216), new mp.Vector3(-4.462359E-05, -6.329292E-05, 160), false, false);
    object.create(309416120, new mp.Vector3(120.5594, -358.2233, 66.17326), new mp.Vector3(-4.46236E-05, 2.23118E-05, -20), false, false);
    object.create(1867879106, new mp.Vector3(114.2779, -363.8434, 54.50181), new mp.Vector3(0, 0, 40.70032), false, false);
    object.create(1867879106, new mp.Vector3(97.5201, -346.5287, 66.14909), new mp.Vector3(0, 0, -99.29946), false, false);

    // Лифты на стройке Pillbox Hill
    object.create(1925435073, new mp.Vector3(-158.76, -942.28, 115.63), new mp.Vector3(0, 0, -19.99998), false, false);
    object.create(1925435073, new mp.Vector3(-158.79, -942.29, 270.53), new mp.Vector3(0, 0, 160), false, false);
    object.create(1925435073, new mp.Vector3(-158.76, -942.28, 31.38), new mp.Vector3(0, 0, -19.99998), false, false);
    object.create(1925435073, new mp.Vector3(-158.79, -942.29, 31.38), new mp.Vector3(0, 0, 160), false, false);
    object.create(1925435073, new mp.Vector3(-182.22, -1016.46, 115.51), new mp.Vector3(0, 0, -110), false, false);
    object.create(1925435073, new mp.Vector3(-182.21, -1016.42, 31.37), new mp.Vector3(0, 0, 70.09389), false, false);
    object.create(1925435073, new mp.Vector3(-182.22, -1016.46, 31.37), new mp.Vector3(0, 0, -110), false, false);
    object.create(1925435073, new mp.Vector3(-182.21, -1016.42, 115.51), new mp.Vector3(0, 0, 70.09389), false, false);
    object.create(1925435073, new mp.Vector3(-158.79, -942.29, 115.63), new mp.Vector3(0, 0, 160), false, false);
    object.create(1925435073, new mp.Vector3(-158.76, -942.28, 270.53), new mp.Vector3(0, 0, -19.99998), false, false);

    // Int 1
    object.create(2079702193, new mp.Vector3(1975.56, 3822.615, 34.21246), new mp.Vector3(1.001791E-05, 5.008956E-06, 30.0498), false, false);
    object.create(2079702193, new mp.Vector3(1978.14, 3818.533, 34.21576), new mp.Vector3(1.00179E-05, 5.008956E-06, -149.9994), false, false);
    object.create(2079702193, new mp.Vector3(1975.25, 3816.847, 34.59501), new mp.Vector3(1.00179E-05, 5.008956E-06, -149.9994), false, false);
    object.create(2079702193, new mp.Vector3(1977.93, 3822.51, 34.15), new mp.Vector3(-14.69982, 0.2406464, -60.07864), false, false);
    object.create(2079702193, new mp.Vector3(1978.92, 3820.79, 34.15), new mp.Vector3(-14.69982, 0.240646, -60.07864), false, false);
    object.create(2079702193, new mp.Vector3(1979.1, 3820.486, 34.15), new mp.Vector3(-14.69982, 0.2406473, -60.07863), false, false);

// Int 4
    object.create(1404517486, new mp.Vector3(264.59, -995.83, -97.3), new mp.Vector3(0, 0, 0), false, false);
    object.create(1404517486, new mp.Vector3(264.59, -996.74, -97.3), new mp.Vector3(0, 0, 0), false, false);
    object.create(1556826721, new mp.Vector3(258.36, -994.7146, -100.0086), new mp.Vector3(0, 0, -29.99981), false, false);
    object.create(2004890126, new mp.Vector3(256.28, -998.28, -100.0086), new mp.Vector3(0, 0, 123.9997), false, false);
    object.create(630784631, new mp.Vector3(262.6944, -1001.486, -98.24239), new mp.Vector3(0, 0, 179.9996), false, false);
    object.create(-1884999004, new mp.Vector3(261.48, -997.8755, -99.78), new mp.Vector3(0, 0, 8.999984), false, false);
    object.create(1398355146, new mp.Vector3(265.78, -1001.55, -98.85782), new mp.Vector3(0, 0, 0), false, false);

// Int 5
    object.create(-1113453233, new mp.Vector3(-1152.59, -1523.245, 10.95272), new mp.Vector3(1.017777E-12, -5.008956E-06, -145.0245), false, false);
    object.create(-856584171, new mp.Vector3(-1148.74, -1513.23, 9.682452), new mp.Vector3(1.001789E-05, 5.008956E-06, -10.00001), false, false);
    object.create(-1350614541, new mp.Vector3(-1156.203, -1525.353, 9.631849), new mp.Vector3(0, 0, -124.0001), false, false);
    object.create(-1113453233, new mp.Vector3(-1161.52, -1521.869, 9.8), new mp.Vector3(1.001791E-05, 5.008956E-06, 124.98), false, false);
    object.create(-1113453233, new mp.Vector3(-1161.52, -1521.869, 10.99), new mp.Vector3(1.001791E-05, 5.008956E-06, 124.98), false, false);
    object.create(-1113453233, new mp.Vector3(-1161.79, -1521.49, 12), new mp.Vector3(1.001791E-05, 5.008956E-06, 124.98), false, false);
    object.create(-1113453233, new mp.Vector3(-1161.79, -1521.49, 9.63), new mp.Vector3(1.001791E-05, 5.008956E-06, 124.98), false, false);
    object.create(-1113453233, new mp.Vector3(-1161.79, -1521.49, 10.81), new mp.Vector3(1.001791E-05, 5.008956E-06, 124.98), false, false);
    object.create(-1113453233, new mp.Vector3(-1158.99, -1525.48, 9.81), new mp.Vector3(1.001791E-05, 5.008956E-06, 124.98), false, false);
    object.create(-1113453233, new mp.Vector3(-1158.99, -1525.48, 11), new mp.Vector3(1.001791E-05, 5.008956E-06, 124.98), false, false);
    object.create(-1113453233, new mp.Vector3(-1160.16, -1523.807, 9.81), new mp.Vector3(1.001791E-05, 5.008956E-06, 124.98), false, false);
    object.create(-1113453233, new mp.Vector3(-1160.16, -1523.807, 11), new mp.Vector3(1.001791E-05, 5.008956E-06, 124.98), false, false);
    object.create(-1113453233, new mp.Vector3(-1157.07, -1516.08, 10.37), new mp.Vector3(5.008956E-06, -5.008956E-06, 34.97549), false, false);
    object.create(-1113453233, new mp.Vector3(-1157.07, -1516.08, 11.56), new mp.Vector3(5.008955E-06, -5.008955E-06, 34.97549), false, false);
    object.create(-1113453233, new mp.Vector3(-1146.44, -1511.069, 9.8), new mp.Vector3(2.035555E-13, -5.008955E-06, -55.02429), false, false);
    object.create(-1113453233, new mp.Vector3(-1146.44, -1511.069, 10.99), new mp.Vector3(2.035555E-13, -5.008955E-06, -55.02429), false, false);
    object.create(-1113453233, new mp.Vector3(-1145.31, -1512.73, 9.8), new mp.Vector3(2.035555E-13, -5.008955E-06, -55.02429), false, false);
    object.create(-1113453233, new mp.Vector3(-1145.31, -1512.73, 10.99), new mp.Vector3(2.035555E-13, -5.008955E-06, -55.02429), false, false);
    object.create(-936729545, new mp.Vector3(-1161.6, -1521.76, 10.57), new mp.Vector3(1.001791E-05, -5.008957E-06, -55.02488), false, false);
    object.create(-936729545, new mp.Vector3(-1161.605, -1521.76, 11.05), new mp.Vector3(1.001791E-05, -5.008957E-06, -55.02487), false, false);
    object.create(-936729545, new mp.Vector3(-1159.13, -1525.29, 10.58), new mp.Vector3(1.00179E-05, -5.008956E-06, -55.07461), false, false);
    object.create(-936729545, new mp.Vector3(-1159.13, -1525.29, 11.05), new mp.Vector3(1.00179E-05, -5.008956E-06, -55.07461), false, false);
    object.create(-936729545, new mp.Vector3(-1146.403, -1511.13, 10.56), new mp.Vector3(1.001791E-05, -5.008945E-06, 124.8749), false, false);
    object.create(-936729545, new mp.Vector3(-1146.405, -1511.13, 11.04), new mp.Vector3(1.001791E-05, -5.008945E-06, 124.8749), false, false);
    object.create(-936729545, new mp.Vector3(-1156.95, -1516.02, 11.16), new mp.Vector3(1.001791E-05, -5.008937E-06, -144.925), false, false);
    object.create(-936729545, new mp.Vector3(-1152.6, -1523.22, 11.23657), new mp.Vector3(1.001789E-05, 5.008955E-06, 35.10036), false, false);
    object.create(1055533654, new mp.Vector3(-1151.98, -1521.43, 10.53337), new mp.Vector3(0, 0, 130), false, false);

    object.delete(1333481871, -1147.072, -1513.776, 10.40341);
    object.delete(1258923146, -1149.182, -1513.149, 9.654871);
    object.delete(797240705, -1149.215, -1512.77, 9.654378);
    object.delete(492521774, -1149.632, -1512.585, 9.655569);
    object.delete(32477783, -1150.278, -1512.184, 10.41471);
    object.delete(419020243, -1147.349, -1513.848, 10.41411);
    object.delete(1319414056, -1147.431, -1514.007, 10.49785);
    object.delete(1013548210, -1147.834, -1514.223, 10.41915);
    object.delete(827254092, -1144.454, -1515.907, 10.08414);
    object.delete(-1077568635, -1143.784, -1515.831, 10.03522);
    object.delete(1319414056, -1161.492, -1520.295, 10.25615);
    object.delete(419020243, -1161.181, -1519.775, 10.25615);
    object.delete(1160787715, -1158.4, -1523.117, 10.54145);
    object.delete(520088227, -1158.26, -1523.191, 10.53249);
    object.delete(1560277278, -1156.226, -1522.208, 10.32687);

// Int 6
    object.create(1978613345, new mp.Vector3(351.479, -996.0478, -100.1962), new mp.Vector3(0, 0, 0), false, false);
    object.create(1978613345, new mp.Vector3(350.53, -996.05, -100.1961), new mp.Vector3(0, 0, 0), false, false);
    object.create(951345131, new mp.Vector3(350.8078, -994.3985, -100.08), new mp.Vector3(1.001785E-05, 5.008952E-06, -132.5001), false, false);
    object.create(2057223314, new mp.Vector3(352.1311, -993.4043, -100.12), new mp.Vector3(0, 0, -36.99995), false, false);
    object.create(-978849650, new mp.Vector3(337.51, -996.68, -99.55), new mp.Vector3(0, 0, -90.00005), false, false);
    object.create(1881864012, new mp.Vector3(341.6673, -996.1204, -99.65), new mp.Vector3(0, 0, -62.99994), false, false);
    object.create(-807401144, new mp.Vector3(341.3907, -996.1807, -99.65697), new mp.Vector3(0, 0, 69.99995), false, false);
    object.create(470212711, new mp.Vector3(341.99, -1004.06, -99.21622), new mp.Vector3(0, 0, 54.99997), false, false);
    object.create(-331509782, new mp.Vector3(342.3735, -1004.137, -99.16), new mp.Vector3(0, 0, 29.99998), false, false);
    object.create(1319392426, new mp.Vector3(342.251, -1004.089, -99.16), new mp.Vector3(0, 0, 104.9999), false, false);
    object.create(-2037843699, new mp.Vector3(341.6503, -1003.813, -99.16), new mp.Vector3(0, 0, 104.9999), false, false);
    object.create(477649989, new mp.Vector3(342.39, -1003.78, -99.21622), new mp.Vector3(1.001788E-05, -5.008956E-06, -179.4498), false, false);
    object.create(-1246711311, new mp.Vector3(352.7462, -992.9322, -100.1962), new mp.Vector3(0, 0, -79.99947), false, false);
    object.create(-2044627725, new mp.Vector3(343.22, -994, -99.71), new mp.Vector3(0, 0, 74.99995), false, false);
    object.create(-1328202619, new mp.Vector3(348.0154, -1002.648, -100.1962), new mp.Vector3(0, 0, 0), false, false);
    object.create(-1769322543, new mp.Vector3(348.7386, -995.0312, -99.43916), new mp.Vector3(0, 0, 21.89992), false, false);
    object.create(-1884999004, new mp.Vector3(343.0679, -998.2321, -99.97), new mp.Vector3(0, 0, 0), false, false);
    object.create(-1989035681, new mp.Vector3(350.644, -999.722, -99.2), new mp.Vector3(0, 0, -166.0001), false, false);
    object.create(-364924791, new mp.Vector3(339.4279, -1003.846, -99.27671), new mp.Vector3(0, -5.008956E-06, -180), false, false);
    object.create(-331509782, new mp.Vector3(339.3438, -995.3307, -99.65813), new mp.Vector3(0, 0, 14.99997), false, false);
    object.create(-331509782, new mp.Vector3(339.5025, -995.2882, -99.65813), new mp.Vector3(0, 0, 144.9998), false, false);
    object.create(-1540767983, new mp.Vector3(351.9503, -999.8756, -99.25986), new mp.Vector3(0, 0, 2.599953), false, false);
    object.create(1398355146, new mp.Vector3(345.86, -1003.03, -99.04), new mp.Vector3(0, -5.008956E-06, -180), false, false);

    object.delete(492521774, 341.5645, -995.9878, -99.65434);
    object.delete(-664859048, 352.6909, -993.5197, -100.2083);
    object.delete(32477783, 341.602, -995.6356, -99.65398);
    object.delete(996113921, 341.5686, -996.3506, -99.63911);
    object.delete(1356866689, 341.6109, -995.6426, -99.62861);
    object.delete(-1158929576, 341.2068, -995.6591, -99.60791);
    object.delete(-502099890, 341.1056, -996.3447, -99.59258);
    object.delete(270388964, 341.6335, -996.7438, -99.65703);
    object.delete(-1264675346, 339.9229, -1001.782, -99.39119);
    object.delete(1160787715, 338.8171, -1001.489, -99.3647);
    object.delete(520088227, 339.4384, -1001.095, -99.37474);
    object.delete(-1264675346, 351.8941, -1000.098, -99.18714);
    object.delete(-1533900808, 341.9066, -1001.67, -99.23304);
    object.delete(-807401144, 341.8589, -1000.846, -99.31647);
    object.delete(-664859048, 345.3659, -992.827, -100.2083);
    object.delete(97410561, 345.5305, -1002.223, -99.30497);

// Int 7
    object.create(2079702193, new mp.Vector3(-10.29, -1442.83, 31.15963), new mp.Vector3(1.001791E-05, 5.008956E-06, -179.6995), false, false);
    object.create(2079702193, new mp.Vector3(-10.29, -1442.83, 31.98463), new mp.Vector3(1.001791E-05, 5.008956E-06, -179.6995), false, false);
    object.create(2079702193, new mp.Vector3(-10.36, -1426.92, 31.77), new mp.Vector3(1.001791E-05, 5.008956E-06, 0.3004003), false, false);
    object.create(2079702193, new mp.Vector3(-13.56, -1441.16, 31.28), new mp.Vector3(0, -5.008956E-06, -180), false, false);
    object.create(2079702193, new mp.Vector3(-13.56, -1441.16, 32.03001), new mp.Vector3(0, -5.008956E-06, -180), false, false);
    object.create(2079702193, new mp.Vector3(-14.91, -1441.16, 32.03001), new mp.Vector3(0, -5.008956E-06, -180), false, false);
    object.create(2079702193, new mp.Vector3(-14.91, -1441.16, 31.205), new mp.Vector3(0, -5.008956E-06, -180), false, false);
    object.create(506946533, new mp.Vector3(-14.92, -1427.13, 31.4), new mp.Vector3(1.001785E-05, 5.008956E-06, -6.899237), false, false);
    object.create(246006942, new mp.Vector3(-14.6, -1427.1, 31.38808), new mp.Vector3(0, 0, 0), false, false);
    object.create(687012144, new mp.Vector3(-14.23, -1427.1, 31.3), new mp.Vector3(0, 0, 13.99999), false, false);
    object.create(-1856393901, new mp.Vector3(-14.55637, -1427.31, 30.59), new mp.Vector3(-18.00005, -5.330159E-06, 1.750024), false, false);

// Int 8
    object.create(-1154592059, new mp.Vector3(-8.15, 513.5, 173.6282), new mp.Vector3(0, 0, -29.31598), true, false);
    object.create(2079702193, new mp.Vector3(15.24, 537.2923, 174.27), new mp.Vector3(1.00179E-05, -5.008956E-06, -155.0239), false, false);
    object.create(2079702193, new mp.Vector3(15.24, 537.2923, 175.38), new mp.Vector3(1.00179E-05, -5.008956E-06, -155.0239), false, false);
    object.create(2079702193, new mp.Vector3(15.24, 537.2923, 176.355), new mp.Vector3(1.00179E-05, -5.008956E-06, -155.0239), false, false);
    object.create(2079702193, new mp.Vector3(14.07, 527.38, 174.2382), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(14.07, 527.38, 175.34), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(14.07, 527.38, 176.44), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(12.68, 526.7334, 174.2382), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(12.68, 526.7334, 175.33), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(12.68, 526.7334, 176.43), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(10.91, 525.79, 174.2382), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(10.91, 525.79, 175.34), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(10.91, 525.79, 176.44), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(9.57, 525.17, 174.2382), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(9.57, 525.17, 175.35), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(9.57, 525.17, 176.46), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(6.86, 524.02, 174.2382), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(6.86, 524.02, 175.34), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(6.86, 524.02, 176.44), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(5.06, 523.18, 174.2382), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(5.06, 523.18, 175.34), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(5.06, 523.18, 176.45), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(5.02, 523.16, 174.2382), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(5.02, 523.16, 175.34), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(5.02, 523.16, 176.24), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(3.19, 522.19, 174.2382), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(3.19, 522.19, 175.34), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(3.19, 522.19, 176.43), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(1.39, 521.35, 174.2382), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(1.39, 521.35, 175.35), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(1.39, 521.35, 176.46), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(1.35, 521.33, 174.2382), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(1.35, 521.33, 175.34), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(1.35, 521.33, 176.44), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(-2.83, 518.67, 174.24), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-2.83, 518.67, 175.35), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-2.83, 518.67, 176.45), new mp.Vector3(1.250441E-09, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-3.800568, 516.94, 174.24), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-3.800568, 516.94, 175.35), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-3.800568, 516.94, 176.46), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-4.89, 515.21, 174.24), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-4.89, 515.21, 175.34), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-4.89, 515.21, 176.44), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-5.86, 513.48, 174.24), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-5.86, 513.48, 175.35), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-5.86, 513.48, 176.46), new mp.Vector3(1.831999E-12, -5.008956E-06, -119.3748), false, false);
    object.create(2079702193, new mp.Vector3(-10.84, 514.89, 174.28), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-10.84, 514.89, 175.37), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-10.84, 514.89, 176.48), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-12.57, 515.865, 174.28), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-12.57, 515.865, 175.39), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-12.57, 515.865, 176.5), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-12.68, 515.93, 174.28), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-12.68, 515.93, 175.37), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-12.68, 515.93, 176.47), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-8.98, 513.95, 174.28), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-8.98, 513.95, 175.39), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-8.98, 513.95, 176.5), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-7.29, 513, 174.28), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-7.29, 513, 175.38), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(-7.29, 513, 176.49), new mp.Vector3(1.001791E-05, 5.008956E-06, 150.5997), false, false);
    object.create(2079702193, new mp.Vector3(12.99, 533.9, 174.2336), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(12.99, 533.9, 175.34), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(12.99, 533.9, 176.44), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(13.52, 532.7679, 174.2336), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(13.52, 532.7679, 175.34), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(13.52, 532.7679, 176.44), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(14.31, 530.84, 174.2336), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(14.31, 530.84, 175.34), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(14.31, 530.84, 176.44), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(14.91, 529.55, 174.2336), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(14.91, 529.55, 175.34), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(14.91, 529.55, 176.39), new mp.Vector3(1.001791E-05, -5.008955E-06, -65.02461), false, false);
    object.create(2079702193, new mp.Vector3(10.82, 525.85, 170.28), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(10.82, 525.85, 171.38), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(10.82, 525.85, 172.49), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(9.49, 525.23, 170.28), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(9.49, 525.23, 171.38), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(9.49, 525.23, 172.48), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(6.9, 523.94, 170.28), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(6.9, 523.94, 171.39), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(6.9, 523.94, 172.5), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(5.14, 523.12, 170.28), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(5.14, 523.12, 171.38), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(2079702193, new mp.Vector3(5.14, 523.12, 172.48), new mp.Vector3(1.00179E-05, -5.008955E-06, -155), false, false);
    object.create(-1154592059, new mp.Vector3(2.14, 521.84, 169.63), new mp.Vector3(0, 0, 24.88396), false, false);
    object.create(-1154592059, new mp.Vector3(2.15, 521.84, 169.73), new mp.Vector3(0, 0, 24.88396), false, false);
    object.create(2079702193, new mp.Vector3(4.37, 522.87, 170.29), new mp.Vector3(1.001791E-05, -5.008956E-06, -155.0237), false, false);
    object.create(2079702193, new mp.Vector3(4.37, 522.87, 171.4), new mp.Vector3(1.001791E-05, -5.008956E-06, -155.0237), false, false);
    object.create(2079702193, new mp.Vector3(4.37, 522.87, 172.51), new mp.Vector3(1.001791E-05, -5.008956E-06, -155.0237), false, false);
    object.create(2079702193, new mp.Vector3(2.57, 522.03, 170.29), new mp.Vector3(1.001791E-05, -5.008956E-06, -155.0237), false, false);
    object.create(2079702193, new mp.Vector3(2.57, 522.03, 171.4), new mp.Vector3(1.001791E-05, -5.008956E-06, -155.0237), false, false);
    object.create(2079702193, new mp.Vector3(2.57, 522.03, 172.5), new mp.Vector3(1.001791E-05, -5.008956E-06, -155.0237), false, false);
    object.create(2079702193, new mp.Vector3(0.81, 521.2136, 170.29), new mp.Vector3(1.001791E-05, -5.008956E-06, -155.0237), false, false);
    object.create(2079702193, new mp.Vector3(0.81, 521.2136, 171.4), new mp.Vector3(1.001791E-05, -5.008956E-06, -155.0237), false, false);
    object.create(2079702193, new mp.Vector3(0.81, 521.2136, 172.48), new mp.Vector3(1.001791E-05, -5.008956E-06, -155.0237), false, false);

    object.delete(-1154592059, -9.796242, 514.4293, 173.6281);

// Int 9
    object.create(2079702193, new mp.Vector3(-793.81, 181.6, 74.58), new mp.Vector3(1.001791E-05, 5.008957E-06, -69.02483), false, false);
    object.create(2079702193, new mp.Vector3(-793.81, 181.6, 73.47), new mp.Vector3(1.001791E-05, 5.008957E-06, -69.02484), false, false);
    object.create(2079702193, new mp.Vector3(-793.81, 181.6, 72.35), new mp.Vector3(1.001791E-05, 5.008955E-06, -69.02483), false, false);
    object.create(2079702193, new mp.Vector3(-793.72, 181.3724, 72.35), new mp.Vector3(1.001791E-05, 5.008955E-06, -69.02483), false, false);
    object.create(2079702193, new mp.Vector3(-793.72, 181.3724, 73.46), new mp.Vector3(1.001791E-05, 5.008955E-06, -69.02483), false, false);
    object.create(2079702193, new mp.Vector3(-793.72, 181.3724, 74.56), new mp.Vector3(1.001791E-05, 5.008955E-06, -69.02483), false, false);
    object.create(2079702193, new mp.Vector3(-795.69, 187.0083, 73.35403), new mp.Vector3(1.001791E-05, 5.008955E-06, -69.02483), false, false);
    object.create(2079702193, new mp.Vector3(-795.69, 187.0083, 74.46), new mp.Vector3(1.001791E-05, 5.008955E-06, -69.02483), false, false);
    object.create(2079702193, new mp.Vector3(-795.48, 177.63, 74.59), new mp.Vector3(1.001783E-05, -5.008956E-06, -158.8983), false, false);
    object.create(2079702193, new mp.Vector3(-795.48, 177.63, 73.5), new mp.Vector3(1.001783E-05, -5.008956E-06, -158.8983), false, false);
    object.create(2079702193, new mp.Vector3(-795.48, 177.63, 72.4), new mp.Vector3(1.001783E-05, -5.008956E-06, -158.8983), false, false);
    object.create(2079702193, new mp.Vector3(-796.34, 177.3059, 72.57), new mp.Vector3(1.001783E-05, -5.008956E-06, -159.0483), false, false);
    object.create(2079702193, new mp.Vector3(-796.34, 177.3059, 73.62), new mp.Vector3(1.001783E-05, -5.008956E-06, -159.0483), false, false);
    object.create(2079702193, new mp.Vector3(-796.34, 177.3059, 74.14498), new mp.Vector3(1.001783E-05, -5.008956E-06, -159.0483), false, false);
    object.create(2079702193, new mp.Vector3(-798.21, 171.0743, 73.23387), new mp.Vector3(1.001791E-05, 5.008955E-06, -69.02483), false, false);
    object.create(2079702193, new mp.Vector3(-798.21, 171.0743, 74.33), new mp.Vector3(1.001791E-05, 5.008955E-06, -69.02483), false, false);
    object.create(2079702193, new mp.Vector3(-798.21, 171.0743, 75.4), new mp.Vector3(1.001791E-05, 5.008955E-06, -69.02483), false, false);
    object.create(2079702193, new mp.Vector3(-799.1232, 168.9022, 73.32), new mp.Vector3(1.001783E-05, -5.008956E-06, -158.8983), false, false);
    object.create(2079702193, new mp.Vector3(-799.1232, 168.9022, 74.42), new mp.Vector3(1.001783E-05, -5.008956E-06, -158.8983), false, false);
    object.create(2079702193, new mp.Vector3(-799.1232, 168.9022, 74.71999), new mp.Vector3(1.001783E-05, -5.008956E-06, -158.8983), false, false);
    object.create(2079702193, new mp.Vector3(-816.73, 181.8873, 73.01957), new mp.Vector3(1.001789E-05, -5.008955E-06, 21.00013), false, false);
    object.create(2079702193, new mp.Vector3(-816.73, 181.8873, 74.12), new mp.Vector3(1.001789E-05, -5.008954E-06, 21.00013), false, false);
    object.create(1019527301, new mp.Vector3(-802.78, 167.61, 77.58), new mp.Vector3(1.001791E-05, 5.008956E-06, 20.94992), false, false);
    object.create(2079702193, new mp.Vector3(-802.31, 167.7864, 76.94), new mp.Vector3(1.001782E-05, -5.008956E-06, -159.0478), false, false);
    object.create(2079702193, new mp.Vector3(-802.31, 167.7864, 78.04), new mp.Vector3(1.001782E-05, -5.008956E-06, -159.0478), false, false);
    object.create(2079702193, new mp.Vector3(-802.31, 167.7864, 78.23), new mp.Vector3(1.001782E-05, -5.008955E-06, -159.0478), false, false);

// Int 10
    object.create(2079702193, new mp.Vector3(-769.26, 344.1094, 211.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-769.26, 344.1094, 212.17), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-769.26, 344.1094, 213.29), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-771.25, 344.1094, 211.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-771.25, 344.1094, 212.17), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-771.25, 344.1094, 213.29), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-773.24, 344.1094, 211.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-773.24, 344.1094, 212.17), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-773.24, 344.1094, 213.29), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-775.29, 344.1094, 211.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-775.29, 344.1094, 212.17), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-775.29, 344.1094, 213.29), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-777.27, 344.1094, 211.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-777.27, 344.1094, 212.17), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-777.27, 344.1094, 213.29), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-786.42, 342.47, 210.85), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-786.42, 342.47, 211.96), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-786.42, 342.47, 213.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-786.42, 342.48, 214.17), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-784.44, 342.47, 210.85), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-784.44, 342.47, 211.96), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-784.44, 342.47, 213.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-784.44, 342.47, 214.17), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-790.44, 336.19, 210.41), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-790.44, 336.19, 211.52), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-792.42, 336.19, 211.52), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-792.42, 336.19, 210.47), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-794.4, 336.19, 211.52), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-794.4, 336.19, 210.41), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-794.4, 336.19, 212.63), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-792.41, 336.19, 212.63), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-790.43, 336.19, 212.63), new mp.Vector3(0, 0, 0), false, false);

// Int 11
    object.create(2079702193, new mp.Vector3(-757.74, 609.0231, 144.7975), new mp.Vector3(1.001788E-05, -5.008957E-06, -161.5), false, false);
    object.create(2079702193, new mp.Vector3(-764.45, 606.827, 144.52), new mp.Vector3(0, 0, -161.4989), false, false);
    object.create(2079702193, new mp.Vector3(-764.45, 606.827, 145.62), new mp.Vector3(0, 0, -161.4989), false, false);
    object.create(2079702193, new mp.Vector3(-766.38, 606.185, 144.52), new mp.Vector3(0, 0, -161.4989), false, false);
    object.create(2079702193, new mp.Vector3(-766.38, 606.185, 145.62), new mp.Vector3(0, 0, -161.4989), false, false);
    object.create(2079702193, new mp.Vector3(-777.81, 611.66, 143.36), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.81, 611.66, 144.47), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.81, 611.66, 145.58), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.18, 609.776, 143.36), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.18, 609.776, 144.46), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.18, 609.776, 145.57), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-776.55, 607.89, 143.36), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-776.55, 607.89, 144.46), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-776.55, 607.89, 145.56), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.92, 606, 143.36), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.92, 606, 144.46), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.92, 606, 145.56), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.315, 604.19, 143.36), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.315, 604.19, 144.46), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.315, 604.19, 145.56), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.83, 611.65, 139.96), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.83, 611.65, 141.06), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.83, 611.65, 142.16), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.19, 609.76, 139.96), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.19, 609.76, 141.06), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-777.19, 609.76, 142.16), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-776.56, 607.88, 139.96), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-776.56, 607.88, 141.06), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-776.56, 607.88, 142.17), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.93, 605.99, 139.96), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.93, 605.99, 141.07), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.93, 605.99, 142.18), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.33, 604.18, 139.96), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.33, 604.18, 141.06), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-775.33, 604.18, 142.16), new mp.Vector3(6.411998E-12, -5.008956E-06, 108.5), false, false);
    object.create(2079702193, new mp.Vector3(-773.11, 603.86, 141.7318), new mp.Vector3(0, 0, -161.4989), false, false);
    object.create(2079702193, new mp.Vector3(-773.1, 603.8708, 140.63), new mp.Vector3(0, 0, -161.4989), false, false);

// Int 12
    object.create(2079702193, new mp.Vector3(-1290.16, 428.36, 97.1), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1290.16, 428.36, 98.2), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1290.16, 428.36, 99.31), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1288.18, 428.36, 97.1), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1288.18, 428.36, 98.2), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1288.18, 428.36, 99.3), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1286.2, 428.36, 97.1), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1286.2, 428.36, 98.2), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1286.2, 428.36, 99.3), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1284.21, 428.36, 97.1), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1284.21, 428.36, 98.21), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1284.21, 428.36, 99.32), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1282.23, 428.36, 97.1), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1282.23, 428.36, 98.2), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1282.23, 428.36, 99.3), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1281.29, 446.65, 98.41), new mp.Vector3(6.329293E-05, 6.329292E-05, -89.99001), false, false);
    object.create(2079702193, new mp.Vector3(-1281.29, 437.49, 98.21005), new mp.Vector3(6.329293E-05, 6.329289E-05, -89.98997), false, false);
    object.create(2079702193, new mp.Vector3(-1281.29, 437.49, 99.32), new mp.Vector3(6.329293E-05, 6.329286E-05, -89.98996), false, false);
    object.create(2079702193, new mp.Vector3(-1281.29, 439.49, 98.21005), new mp.Vector3(6.329293E-05, 6.329286E-05, -89.98996), false, false);
    object.create(2079702193, new mp.Vector3(-1281.29, 439.49, 99.32), new mp.Vector3(6.329293E-05, 6.329281E-05, -89.98991), false, false);
    object.create(2079702193, new mp.Vector3(-1290.16, 428.34, 93.72), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1290.16, 428.34, 94.82), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1290.16, 428.34, 95.93), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1288.18, 428.34, 93.72), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1288.18, 428.34, 94.82), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1288.18, 428.34, 95.92), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1286.2, 428.34, 93.72), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1286.2, 428.34, 94.82), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1286.2, 428.34, 95.92), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1284.21, 428.34, 93.72), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1284.21, 428.34, 94.82), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1284.21, 428.34, 95.92), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1282.23, 428.34, 93.72), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1282.23, 428.34, 94.82), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1282.23, 428.34, 95.92), new mp.Vector3(-4.462359E-05, -6.329293E-05, -179.99), false, false);
    object.create(2079702193, new mp.Vector3(-1281.28, 430.24, 94.2196), new mp.Vector3(6.329293E-05, 6.329289E-05, -89.98997), false, false);
    object.create(2079702193, new mp.Vector3(-1281.28, 430.24, 95.32), new mp.Vector3(6.329293E-05, 6.329286E-05, -89.98996), false, false);

// Int 13
    object.create(2079702193, new mp.Vector3(-781.37, 343.96, 216.48), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-781.37, 343.96, 217.59), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-781.37, 343.96, 218.7), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-783.35, 343.96, 216.48), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-783.35, 343.96, 217.58), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-783.35, 343.96, 218.68), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-785.33, 343.96, 216.48), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-785.33, 343.96, 217.58), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-785.33, 343.96, 218.68), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.31, 343.96, 216.48), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.31, 343.96, 217.58), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.31, 343.96, 218.69), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-789.29, 343.96, 216.48), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-789.29, 343.96, 217.59), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-789.29, 343.96, 218.7), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-796.37, 340.36, 220.08), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-796.37, 340.36, 221.18), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-796.37, 340.36, 222.29), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-798.35, 340.36, 220.08), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-798.35, 340.36, 221.18), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-798.35, 340.36, 222.29), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-799.97, 340.36, 220.08), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-799.97, 340.36, 221.19), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-799.97, 340.36, 222.3), new mp.Vector3(0, 0, 0), false, false);

// Int 14
    object.create(2079702193, new mp.Vector3(-787.32, 343.54, 205.87), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.32, 343.54, 206.98), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.32, 343.54, 208.09), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.85, 343.54, 205.87), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.85, 343.54, 206.98), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.85, 343.54, 208.08), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-790.52, 343.54, 205.87), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-790.52, 343.54, 206.98), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-790.52, 343.54, 208.08), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-792.5, 343.54, 205.87), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-792.5, 343.54, 206.98), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-792.5, 343.54, 208.08), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-794.48, 343.54, 205.87), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-794.48, 343.54, 206.98), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-794.48, 343.54, 208.08), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-796.46, 343.54, 205.88), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-796.46, 343.54, 206.98), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-796.46, 343.54, 208.08), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 341.93, 205.88), new mp.Vector3(2.564906E-12, -5.008952E-06, 89.99995), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 341.93, 206.99), new mp.Vector3(3.732026E-12, -5.008951E-06, 89.99993), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 341.93, 208.1), new mp.Vector3(5.292704E-12, -5.008949E-06, 89.99989), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 339.94, 205.88), new mp.Vector3(3.732026E-12, -5.008951E-06, 89.99993), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 339.94, 206.99), new mp.Vector3(5.292704E-12, -5.008949E-06, 89.99989), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 339.94, 208.1), new mp.Vector3(7.844052E-12, -5.008947E-06, 89.99985), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 337.96, 205.88), new mp.Vector3(5.292704E-12, -5.008949E-06, 89.99989), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 337.96, 206.98), new mp.Vector3(7.844052E-12, -5.008947E-06, 89.99985), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 337.96, 208.08), new mp.Vector3(1.116895E-11, -5.008944E-06, 89.99978), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 335.98, 205.88), new mp.Vector3(7.844052E-12, -5.008947E-06, 89.99985), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 335.98, 206.98), new mp.Vector3(1.116895E-11, -5.008944E-06, 89.99978), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 335.98, 208.08), new mp.Vector3(1.448029E-11, -5.008941E-06, 89.9997), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 334, 206.99), new mp.Vector3(1.448029E-11, -5.008941E-06, 89.9997), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 334, 208.1), new mp.Vector3(1.857873E-11, -5.008937E-06, 89.99962), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 334, 205.88), new mp.Vector3(1.857873E-11, -5.008937E-06, 89.99962), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 327.94, 205.88), new mp.Vector3(2.208005E-11, -5.008933E-06, 89.99953), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 327.94, 206.99), new mp.Vector3(2.558136E-11, -5.008929E-06, 89.99945), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 327.94, 208.1), new mp.Vector3(2.928621E-11, -5.008925E-06, 89.99937), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 325.96, 205.88), new mp.Vector3(2.558136E-11, -5.008929E-06, 89.99945), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 325.96, 206.98), new mp.Vector3(2.928621E-11, -5.008925E-06, 89.99937), false, false);
    object.create(2079702193, new mp.Vector3(-804.52, 325.96, 208.09), new mp.Vector3(3.299104E-11, -5.008921E-06, 89.99929), false, false);
    object.create(2079702193, new mp.Vector3(-787.32, 343.54, 201.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.32, 343.54, 202.17), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.32, 343.54, 203.28), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.85, 343.54, 201.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.85, 343.54, 202.16), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-787.85, 343.54, 203.27), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-790.52, 343.54, 201.05), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-790.52, 343.54, 202.16), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-790.52, 343.54, 203.26), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-792.5, 343.54, 201.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-792.5, 343.54, 202.17), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-792.5, 343.54, 203.28), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-794.48, 343.54, 201.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-794.48, 343.54, 202.16), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-794.48, 343.54, 203.26), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-796.46, 343.54, 201.06), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-796.46, 343.54, 202.16), new mp.Vector3(0, 0, 0), false, false);
    object.create(2079702193, new mp.Vector3(-796.46, 343.54, 203.26), new mp.Vector3(0, 0, 0), false, false);

    //Dock Mapping
    object.create(1524671283, new mp.Vector3(-426.3395, -2638.948, 7.62), new mp.Vector3(0, 0, 28.9998), false, false);
    object.create(1576342596, new mp.Vector3(-428.1002, -2640.67, 7.5), new mp.Vector3(0, 0, 50.99985), false, false);
    object.create(1935071027, new mp.Vector3(-424.359, -2636.884, 7.5), new mp.Vector3(0, 0, 44.90015), false, false);
    object.create(300547451, new mp.Vector3(-420.5733, -2640.223, 8.26), new mp.Vector3(0, 0, -38.99992), false, false);
    object.create(153748523, new mp.Vector3(-422.7863, -2642.506, 7.51), new mp.Vector3(0, 0, 133.0002), false, false);
    object.create(-188983024, new mp.Vector3(-424.9482, -2644.421, 7.5), new mp.Vector3(0, 0, -44.00007), false, false);
    object.create(1524671283, new mp.Vector3(-431.6065, -2643.968, 7.62), new mp.Vector3(0, 0, 50.99967), false, false);
    object.create(-188983024, new mp.Vector3(-426.1255, -2645.613, 7.5), new mp.Vector3(0, 0, -47.00003), false, false);
    object.create(-188983024, new mp.Vector3(-427.364, -2646.901, 7.5), new mp.Vector3(0, 0, -43.40001), false, false);
    object.create(1524671283, new mp.Vector3(-433.2048, -2645.564, 7.63), new mp.Vector3(0, 0, 37.99947), false, false);
    object.create(300547451, new mp.Vector3(-399.1165, -2639.074, 5.76), new mp.Vector3(0, 0, 42.00002), false, false);
    object.create(1524671283, new mp.Vector3(-401.9056, -2636.135, 5.13), new mp.Vector3(0, 0, 53.99917), false, false);
    object.create(153748523, new mp.Vector3(-400.4529, -2637.686, 5.000217), new mp.Vector3(0, 0, 127.8999), false, false);
    object.create(1935071027, new mp.Vector3(-403.6677, -2635.208, 5.00835), new mp.Vector3(0, 0, 63.89999), false, false);
    object.create(-188983024, new mp.Vector3(-402.352, -2643.216, 5.000216), new mp.Vector3(0, 0, -132.4995), false, false);
    object.create(-188983024, new mp.Vector3(-404.0558, -2644.229, 5.000216), new mp.Vector3(0, 0, -60.00001), false, false);
    object.create(1576342596, new mp.Vector3(-405.3622, -2645.786, 5.000217), new mp.Vector3(0, 0, 43.79976), false, false);
    object.create(-1286880215, new mp.Vector3(-406.5015, -2650.262, 5.000217), new mp.Vector3(0, 0, -134.6452), false, false);
    object.create(-1286880215, new mp.Vector3(-409.755, -2653.563, 5.000217), new mp.Vector3(0, 0, -134.6452), false, false);
    object.create(-1286880215, new mp.Vector3(-413.0188, -2656.853, 5.000217), new mp.Vector3(0, 0, -135.2446), false, false);
    object.create(-1286880215, new mp.Vector3(-397.9273, -2641.651, 5.000217), new mp.Vector3(0, 0, -135.8452), false, false);

    // Баррикада возле Мейз Офис
    object.create(1603241576, new mp.Vector3(50.99, -781.9912, 43.16505), new mp.Vector3(0, 0, 70.19968), false, false);

    //Sheriff LS
    object.delete(mp.game.joaat("prop_sec_gate_01c"), 375.9481, -1632.531, 27.24899);

    //SAPD Dopros
    object.create(995767216, new mp.Vector3(404.63, -997.86, -98.86), new mp.Vector3(1.001789E-05, -5.008956E-06, -89.99954), false, false);
    object.create(995767216, new mp.Vector3(401.1, -996.57, -98.86), new mp.Vector3(1.001787E-05, -5.008956E-06, 70.12512), false, false);
    object.create(96868307, new mp.Vector3(401.1658, -1002.111, -100.0041), new mp.Vector3(0, 0, 106.0001), false, false);
    object.create(-171943901, new mp.Vector3(399.9799, -1004.958, -99.47), new mp.Vector3(1.00179E-05, -5.008955E-06, -93.74994), false, false);
    object.create(-380698483, new mp.Vector3(398.53, -1004.88, -99.61), new mp.Vector3(0, 0, 0), false, false);
    object.create(-171943901, new mp.Vector3(397.15, -1005.16, -99.49), new mp.Vector3(1.00179E-05, 5.008956E-06, 90.99986), false, false);
    object.create(-1609037443, new mp.Vector3(398.7716, -1003.399, -98.50414), new mp.Vector3(0, 0, 0), false, false);
    object.create(-171943901, new mp.Vector3(397.14, -1004.47, -99.49), new mp.Vector3(1.00179E-05, 5.008956E-06, 90.99986), false, false);
    object.create(-598185919, new mp.Vector3(398.8338, -1005.316, -99.15), new mp.Vector3(0, 0, 0), false, false);
    object.create(-598185919, new mp.Vector3(398.3087, -1004.545, -99.15), new mp.Vector3(0, 0, 0), false, false);

    //SAPD Банкомат
    object.create(-870868698, new mp.Vector3(436.36, -988.04, 29.68959), new mp.Vector3(0, 0, 179.8003), false, false);

    //1125
    object.delete(256791144, -1383.038, 476.2039, 105.1749);
    //1127
    object.delete(62686511, -1262.418, 454.9982, 93.71999);
    object.delete(62686511, -1271.905, 446.8963, 93.71999);
    //1128
    object.delete(1875234307, -1065.943, 791.6977, 165.5848);
    object.delete(1875234307, -1062.719, 791.9962, 165.5848);
    object.delete(1875234307, -1037.598, 800.7673, 165.9778);
    //1129
    object.delete(950819638, -1350.465, 565.9646, 129.7136);
    object.delete(950819638, -1351.902, 563.8221, 129.7136);
    //1130
    object.delete(-1258814178, -559.3168, 828.5708, 196.512);
    object.delete(-1258814178, -547.3046, 826.7041, 196.4687);
    //1132
    object.delete(1875234307, -409.4202, 533.9944, 121.2892);
    object.delete(1875234307, -434.9148, 542.8821, 121.0423);
    //1134
    object.delete(1875234307, -167.8585, 432.1422, 110.2436);
    object.delete(1875234307, -176.0664, 424.4883, 110.2434);
    //1135
    object.delete(950819638, 68.90746, 383.5768, 115.517);
    object.delete(950819638, 40.17747, 362.2587, 115.2082);
    //1136
    object.delete(950819638, 184.1877, 578.3342, 184.2537);

    //Большой замок на горе
    object.delete(3341997491,-1788.89, 409.9336, 112.3862);

    //TheLost
    object.delete(2104026129, 981.7929, -117.7915, 79.14376);

    object.delete(267648181, -72.77863, -682,1697, 34.5284);
    object.delete(3717863426, 25.06954, -664,5161, 30.98253);

    //Trucker
    object.delete(-1340926540, 598.834, -2774.979, 5.058189);
    object.delete(1152297372, 586.0738, -2764.908, 5);
    object.delete(-1654693836, 578.3677, -2759.602, 4.851677);
    object.delete(764282027, 574.5524, -2757.531, 5.05706);
    object.delete(-1098506160, 566.8364, -2752.622, 5.056572);
    object.delete(-531344027, 551.111, -2744.125, 4.988312);
    object.delete(1723816705, 554.5585, -2746.729, 5.049309);
    object.delete(2096990081, 556.3549, -2746.204, 5.049797);
    object.delete(2096990081, 553.9969, -2744.615, 5.049187);
    object.delete(-1098506160, 527.8654, -2730.121, 5.056572);
    object.delete(-1036807324, 532.2209, -2725.449, 5.057899);
    object.delete(-1036807324, 529.6422, -2724.043, 5.057899);
    object.delete(1152297372, 501.6503, -2719.297, 5.059914);
    object.delete(-1654693836, 496.8779, -2718.387, 5.068657);
    object.delete(-1340926540, 489.5278, -2712.863, 5.05648);
    object.delete(-1036807324, 498.0302, -2713.531, 5.057976);
    object.delete(-1036807324, 500.1441, -2714.91, 5.05825);
    object.delete(-531344027, 655.1033, -2780.435, 5.114044);
    object.delete(1152297372, 650.8763, -2775.096, 5.105347);
    object.delete(-531344027, 647.1339, -2769.713, 5.104088);
    object.delete(-531344027, 643.2132, -2764.875, 5.10051);
    object.delete(1152297372, 634.9495, -2754.546, 5.100655);
    object.delete(-328261803, -153.3487, -2416.379, 6.62532);
    object.delete(1152297372, -156.8004, -2416.041, 5.001884);

    //Binco
    //object.delete(868499217, -818.7643, -1079.545, 11.47806);
    //object.delete(3146141106, -816.7932, -1078.406, 11.47806);

    // Основной маппинг малого склада Stock

    object.create(-1134789989, new mp.Vector3(1103.438, -3102.897, -39.7), new mp.Vector3(0, 0, 0), false, false, 75);
    object.create(-1719363059, new mp.Vector3(1104.908, -3102.896, -39.62), new mp.Vector3(0, 0, 0), false, false, 76);
    object.create(-1719363059, new mp.Vector3(1103.28, -3102.9, -38.73), new mp.Vector3(1.001786E-05, 5.008955E-06, -90.04958), false, false, 77);
    object.create(-1134789989, new mp.Vector3(1104.8, -3102.88, -38.82), new mp.Vector3(1.001782E-05, 5.008955E-06, -179.9256), false, false, 78);
    object.create(-1134789989, new mp.Vector3(1103.44, -3102.87, -37.93), new mp.Vector3(0, 0, 0), false, false, 79);
    object.create(-1719363059, new mp.Vector3(1104.613, -3102.9, -37.84), new mp.Vector3(0, 0, 0), false, false, 80);
    object.create(1089807209, new mp.Vector3(1102.14, -3103.26, -39.26), new mp.Vector3(0, -5.008956E-06, -180), false, false, 81, 1);

    object.create(-1659828682, new mp.Vector3(1105.48, -3101.43, -38.84), new mp.Vector3(-1.384231E-12, -5.008955E-06, -89.99998), false, false);
    object.create(-1653844078, new mp.Vector3(1104.01, -3103, -39.99993), new mp.Vector3(0, 0, 0), false, false);
    object.create(347760077, new mp.Vector3(1104.103, -3103.102, -38.13803), new mp.Vector3(0, 0, -67.99998), false, false);
    object.create(871161084, new mp.Vector3(1104.248, -3103.024, -39.91068), new mp.Vector3(0, 0, -136.999), false, false);
    object.create(-2004926724, new mp.Vector3(1103.994, -3102.783, -39.03558), new mp.Vector3(0, 0, -179.4991), false, false);
    object.create(-1659670616, new mp.Vector3(1102.872, -3103.059, -39.91068), new mp.Vector3(0, 0, -10.99999), false, false);
    object.create(647318656, new mp.Vector3(1104.209, -3103.114, -39.03558), new mp.Vector3(0, 0, -37.99995), false, false);
    object.create(510965455, new mp.Vector3(1103.996, -3102.932, -39.91068), new mp.Vector3(0, 0, -23.99994), false, false);
    object.create(510965455, new mp.Vector3(1103.76, -3103.087, -39.03558), new mp.Vector3(0, 0, 17.00003), false, false);
    object.create(2086814937, new mp.Vector3(1102.816, -3102.939, -39.03558), new mp.Vector3(0, 0, -21.99993), false, false);

    object.delete(-200982847, 1087.956, -3102.626, -40.00024);
    object.delete(-1069975900, 1087.405, -3102.546, -39.59656);
    object.delete(-1738103333, 1087.467, -3103.16, -39.55749);
    object.delete(171954244, 1087.416, -3103.19, -38.90747);
    object.delete(-288941741, 1087.969, -3103.318, -39.76682);
    object.delete(2057223314, 1087.786, -3100.579, -39.11903);
    object.delete(176137803, 1087.46, -3101.968, -39.19104);
    object.delete(-339081347, 1087.49, -3101.738, -39.18203);
    object.delete(740404217, 1105.251, -3101.934, -39.77567);
    object.delete(-1069975900, 1105.251, -3102.386, -39.59656);

    object.delete(572449021, 1104.012, -3103.057, -39.98313);
    object.delete(572449021, 1101.108, -3103.027, -39.99387);
    object.delete(774227908, 1105.354, -3101.44, -39.06805);

// Основной маппинг среднего склада Stock

    object.create(1089807209, new mp.Vector3(1048.12, -3107.83, -39.32492), new mp.Vector3(-4.46236E-05, 2.231179E-05, 89.99999), false, false, 75, 1);
    object.create(1089807209, new mp.Vector3(1048.116, -3106.941, -39.32492), new mp.Vector3(-4.46236E-05, 2.231179E-05, 89.99999), false, false, 76, 2);
    object.create(-1719363059, new mp.Vector3(1050.986, -3111.007, -39.615), new mp.Vector3(0, 0, 0), false, false, 77);
    object.create(-1719363059, new mp.Vector3(1049.357, -3111, -39.615), new mp.Vector3(0, 0, 90.69976), false, false, 78);
    object.create(-1134789989, new mp.Vector3(1049.751, -3111.112, -38.82), new mp.Vector3(0, 0, -88.49972), false, false, 79);
    object.create(-1134789989, new mp.Vector3(1050.877, -3111.005, -38.82), new mp.Vector3(0, 0, -0.09966588), false, false, 80);
    object.create(-1719363059, new mp.Vector3(1049.666, -3110.977, -37.845), new mp.Vector3(0, 0, 0), false, false, 81);
    object.create(-1719363059, new mp.Vector3(1050.97, -3111.026, -37.845), new mp.Vector3(0, 0, 90.69976), false, false, 82);
    object.create(-1134789989, new mp.Vector3(1048.328, -3110.107, -39.705), new mp.Vector3(0, 0, -88.49972), false, false, 83);
    object.create(-1134789989, new mp.Vector3(1048.322, -3108.908, -37.93), new mp.Vector3(0, 0, -88.49972), false, false, 84);
    object.create(-1134789989, new mp.Vector3(1048.24, -3110.31, -37.93), new mp.Vector3(0, 0, -179.4995), false, false, 85);
    object.create(-1134789989, new mp.Vector3(1048.33, -3108.893, -39.705), new mp.Vector3(0, 0, 88.50024), false, false, 86);
    object.create(-1719363059, new mp.Vector3(1048.359, -3108.869, -38.735), new mp.Vector3(0, 0, -0.3002918), false, false, 87);
    object.create(-1719363059, new mp.Vector3(1048.338, -3110.121, -38.735), new mp.Vector3(0, 0, 89.69965), false, false, 88);

    object.create(-1659828682, new mp.Vector3(1073.51, -3099.978, -38.7), new mp.Vector3(-2.564906E-12, -5.008952E-06, -89.99995), false, false);
    object.create(-1683917950, new mp.Vector3(1048.07, -3094.63, -36.28839), new mp.Vector3(2.564906E-12, -5.008952E-06, 89.99995), false, false);
    object.create(-1683917950, new mp.Vector3(1047.83, -3094.64, -36.3), new mp.Vector3(3.732026E-12, -5.008951E-06, 89.99993), false, false);
    object.create(-1653844078, new mp.Vector3(1050.2, -3111.12, -39.99993), new mp.Vector3(0, 0, 0), false, false);
    object.create(-1653844078, new mp.Vector3(1048.22, -3109.628, -39.99993), new mp.Vector3(-5.97114E-13, -5.008956E-06, -89.99999), false, false);
    object.create(2147289143, new mp.Vector3(1056.401, -3111.64, -35.39232), new mp.Vector3(0, 0, -177.6021), false, false);
    object.create(479783305, new mp.Vector3(1050.09, -3108.62, -34.56526), new mp.Vector3(1.001791E-05, 2.23118E-05, -5.008959E-06), false, false);
    object.create(347760077, new mp.Vector3(1048.284, -3109.535, -39.91675), new mp.Vector3(0, 0, 6.999997), false, false);
    object.create(871161084, new mp.Vector3(1049.167, -3110.846, -39.03558), new mp.Vector3(0, 0, -177.7994), false, false);
    object.create(-2004926724, new mp.Vector3(1048.44, -3109.493, -39.03558), new mp.Vector3(0, 0, 88.99989), false, false);
    object.create(-1659670616, new mp.Vector3(1050.286, -3111.129, -39.03558), new mp.Vector3(0, 0, -21.99999), false, false);
    object.create(510965455, new mp.Vector3(1048.186, -3110.709, -39.03558), new mp.Vector3(0, 0, -53.99994), false, false);
    object.create(510965455, new mp.Vector3(1049.115, -3111.279, -39.03558), new mp.Vector3(0, 0, -103.9998), false, false);
    object.create(1914482766, new mp.Vector3(1050.154, -3110.992, -39.03558), new mp.Vector3(0, 0, -50.99995), false, false);
    object.create(-1987404681, new mp.Vector3(1050.337, -3110.965, -38.1441), new mp.Vector3(0, 0, -129.9999), false, false);
    object.create(-1458189440, new mp.Vector3(1049.988, -3111.124, -39.91675), new mp.Vector3(0, 0, -17.99999), false, false);
    object.create(-1693896857, new mp.Vector3(1050.128, -3111.179, -39.91675), new mp.Vector3(0, 0, 0), false, false);
    object.create(-2067594533, new mp.Vector3(1050.198, -3111.02, -39.91675), new mp.Vector3(0, 0, 2.999955), false, false);
    object.create(-1469896790, new mp.Vector3(1050.307, -3111.279, -39.91675), new mp.Vector3(0, 0, -12.99999), false, false);
    object.create(123488498, new mp.Vector3(1050.486, -3111.2, -39.9), new mp.Vector3(0, 0, -60.99997), false, false);
    object.create(-1960568157, new mp.Vector3(1049.108, -3111.084, -38.13), new mp.Vector3(0, 0, -44.99998), false, false);
    object.create(-1119158544, new mp.Vector3(1048.389, -3109.669, -38.13), new mp.Vector3(0, 0, -40.99998), false, false);

    object.delete(2040839490, 1048.537, -3101.301, -39.47729);
    object.delete(1623033797, 1048.604, -3094.659, -39.97461);
    object.delete(-13720938, 1047.957, -3098.591, -40);
    object.delete(740895081, 1047.908, -3104.158, -39.01764);
    object.delete(1343261146, 1049.849, -3111.289, -39.08353);
    object.delete(1343261146, 1073.177, -3107.978, -39.08353);
    object.delete(-1853453107, 1070.802, -3109.343, -40);
    object.delete(895484294, 1071.861, -3096.517, -40);
    object.delete(2057223314, 1048.376, -3100.055, -39.11857);
    object.delete(176137803, 1048.41, -3101.416, -39.19058);
    object.delete(-339081347, 1048.074, -3101.168, -39.18158);
    object.delete(-2096130282, 1047.932, -3105.301, -39.09033);

    object.delete(3694551461, 1051.075, -3109.071, -40);
    object.delete(1350712180, 1049.091, -3108.253, -39.21489);
    object.delete(3529086555, 1047.978, -3094.091, -37.23187);

    // Остановки (Город)
    object.create(1888204845, new mp.Vector3(-25.00374, -1351.213, 28.31467), new mp.Vector3(0, 0, 0), false, false);
    object.create(2142033519, new mp.Vector3(-651.5632, -869.9038, 23.48871), new mp.Vector3(-0.5250403, -0.1499586, 90.82462), false, false);
    object.create(2142033519, new mp.Vector3(-1199.349, -1189.598, 6.687958), new mp.Vector3(0, 0, -81.99986), false, false);
    object.create(2142033519, new mp.Vector3(-1426.916, -438.0547, 34.88), new mp.Vector3(9.661302E-06, 1.425005, -149.1991), false, false);
    object.create(2142033519, new mp.Vector3(-1012.661, -246.9745, 36.73038), new mp.Vector3(9.988492E-06, -0.07489484, -151.9996), false, false);
    object.create(2142033519, new mp.Vector3(-757.9441, -350.8195, 34.88), new mp.Vector3(-0.8251041, -1.424772, 158.3999), false, false);
    object.create(2142033519, new mp.Vector3(-204.6708, -700.7742, 32.95), new mp.Vector3(9.980403E-06, 1.124995, 159.3999), false, false);
    object.create(2142033519, new mp.Vector3(235.123, -692.5045, 35.61), new mp.Vector3(1.124952, 3.399995, -111.1994), false, false);
    object.create(2142033519, new mp.Vector3(351.6387, -310.4411, 51.99164), new mp.Vector3(5.370342E-06, 6.475041, -107.3995), false, false);
    object.create(2142033519, new mp.Vector3(966.4988, -181.2201, 72.10435), new mp.Vector3(8.015111E-06, -2.999882, 148.9995), false, false);
    object.create(2142033519, new mp.Vector3(1178.494, -444.7159, 65.75287), new mp.Vector3(1.155658E-05, -1.499699, 77.59977), false, false);
    object.create(2142033519, new mp.Vector3(817.7294, -996.8601, 25.24501), new mp.Vector3(-0.4500174, 5.007582E-06, 2.699996), false, false);
    object.create(2142033519, new mp.Vector3(321.01, -1033.08, 28.24), new mp.Vector3(1.00179E-05, -0.149904, 5.008956E-06), false, false);

// Остановки (Загород)
    object.create(2142033519, new mp.Vector3(1558.44, 874.3721, 76.4571), new mp.Vector3(0, 0, -140.9992), false, false);
    object.create(1681727376, new mp.Vector3(1957.909, 2987.314, 44.62), new mp.Vector3(-0.8251861, -0.2252273, 13.59998), false, false);
    object.create(1681727376, new mp.Vector3(1091.956, 2695.625, 37.61), new mp.Vector3(1.250645E-09, 4.963255E-05, -2.999964), false, false);
    object.create(1681727376, new mp.Vector3(394.3408, 2676.185, 43.21), new mp.Vector3(2.135166E-07, 1.499987, 11.69997), false, false);
    object.create(1681727376, new mp.Vector3(229.2961, 3070.666, 41.13), new mp.Vector3(0, 0, -85.99977), false, false);
    object.create(1681727376, new mp.Vector3(1936.598, 3699.375, 31.39), new mp.Vector3(0.1500101, -0.749813, -148.9993), false, false);
    object.create(1888204845, new mp.Vector3(1682.902, 4825.715, 40.95), new mp.Vector3(1.000519E-05, 0.1499586, -83.89984), false, false);
    object.create(1681727376, new mp.Vector3(1653.029, 6419.541, 27.82), new mp.Vector3(-0.5251219, -4.200262, -19.09998), false, false);
    object.create(2142033519, new mp.Vector3(-166.6941, 6383.723, 30.48), new mp.Vector3(1.028865E-05, -6.329292E-05, 43.79989), false, false);
    object.create(2142033519, new mp.Vector3(-438.895, 6052.333, 30.5), new mp.Vector3(1.028862E-05, -6.329292E-05, 116.7995), false, false);
    object.create(1681727376, new mp.Vector3(-942.9807, 5432.132, 37.12), new mp.Vector3(0.8250042, 2.549977, 16.99997), false, false);
    object.create(1681727376, new mp.Vector3(-1532.689, 4996.663, 61.08), new mp.Vector3(-0.6751952, 0.5248131, 49.99994), false, false);
    object.create(1681727376, new mp.Vector3(-2234.323, 4319.973, 47.49), new mp.Vector3(2.074609E-05, -3.649816, 67.29963), false, false);
    object.create(1681727376, new mp.Vector3(-2509.702, 3599.954, 13.39), new mp.Vector3(9.873415E-06, 1.049973, 92.19895), false, false);
    object.create(1681727376, new mp.Vector3(-2741.74, 2289.816, 18.45), new mp.Vector3(0.9000043, 2.850124, 80.29944), false, false);
    object.create(1681727376, new mp.Vector3(-3124.893, 1183.931, 19.44), new mp.Vector3(0, 0, 89.69975), false, false);
    object.create(1681727376, new mp.Vector3(-3026.607, 332.7633, 13.62), new mp.Vector3(3.168344E-08, 0.2999769, 86.5997), false, false);
    object.create(1681727376, new mp.Vector3(-1837.992, -607.2737, 10.35), new mp.Vector3(1.015221E-05, -0.4498585, 141.1494), false, false);
    object.create(2142033519, new mp.Vector3(246.44, -574.35, 42.31), new mp.Vector3(9.618499E-06, 0.374986, 69.37473), false, false);

    // Столбики EMS PillboxHill
    object.create(-994492850, new mp.Vector3(299.3083, -579.6682, 42.26086), new mp.Vector3(0, 0, -10.59997), false, false);
    object.create(-994492850, new mp.Vector3(298.9536, -581.5536, 42.26086), new mp.Vector3(0, 0, -14.49999), false, false);
    object.create(-994492850, new mp.Vector3(298.4625, -583.3111, 42.26086), new mp.Vector3(0, 0, -14.49999), false, false);
    object.create(-994492850, new mp.Vector3(297.924, -584.9352, 42.26086), new mp.Vector3(0, 0, -17.19997), false, false);
    object.create(-994492850, new mp.Vector3(297.269, -586.6929, 42.26086), new mp.Vector3(0, 0, -16.59998), false, false);
    object.create(-994492850, new mp.Vector3(296.5572, -588.6815, 42.26086), new mp.Vector3(0, 0, -16.59998), false, false);

    // Блокировка дверей и ворот снизу больницы Pillbox Hill
    object.create(-982531572, new mp.Vector3(343.4154, -566.52, 30.08493), new mp.Vector3(1.00179E-05, 5.008956E-06, -20.00006), false, false);
    object.create(-982531572, new mp.Vector3(338.9554, -564.91, 30.04101), new mp.Vector3(1.00179E-05, 5.008956E-06, -20.00006), false, false);
    object.create(-982531572, new mp.Vector3(325.56, -560.04, 29.86809), new mp.Vector3(1.00179E-05, 5.008956E-06, -20.00006), false, false);
    object.create(-982531572, new mp.Vector3(329.9954, -561.64, 29.95774), new mp.Vector3(1.00179E-05, 5.008956E-06, -20.00006), false, false);
    object.create(-982531572, new mp.Vector3(334.4736, -563.27, 30.00469), new mp.Vector3(1.00179E-05, 5.008956E-06, -20.00006), false, false);
    object.create(-1829309699, new mp.Vector3(359.09, -584.8922, 29.38), new mp.Vector3(1.00179E-05, 5.008956E-06, 69.94945), false, false);
    object.create(-1829309699, new mp.Vector3(355.33, -595.4761, 29.38), new mp.Vector3(1.00179E-05, 5.008956E-06, 69.94945), false, false);
    object.create(1693207013, new mp.Vector3(338.07, -583.8448, 74.40556), new mp.Vector3(1.001791E-05, -5.008956E-06, -110.7243), false, false);

    // Добавленные гаражные двери и простые двери к домам
    object.create(781635019, new mp.Vector3(-2169.67, 5194.76, 17.02), new mp.Vector3(1.001791E-05, 5.008957E-06, -167.6991), false, false); // Дверь в доме на острове
    object.create(-1857663329, new mp.Vector3(-911.8047, 195.3755, 70.26), new mp.Vector3(0, 0, 0), false, false); // Гаражная дверь дома id 543
    object.create(-1857663329, new mp.Vector3(-905.84, 195.37, 70.26), new mp.Vector3(0, 0, 0), false, false); // Гаражная дверь дома id 543
    object.create(-1857663329, new mp.Vector3(-1128.305, 308.3432, 66.95), new mp.Vector3(1.00179E-05, -5.008956E-06, -9.575194), false, false); // Гаражная дверь дома id 556
    object.create(-1082334994, new mp.Vector3(-1130.57, 315.49, 66.57), new mp.Vector3(1.001791E-05, 5.008956E-06, -9.449916), false, false); // Гаражная дверь дома id 556
    object.create(-1212944997, new mp.Vector3(-1587.19, -58.56, 57.43), new mp.Vector3(1.001791E-05, 5.008956E-06, -90.09966), false, false); // Гаражная дверь дома id 566
    object.create(-1429437264, new mp.Vector3(-1596.58, -55.44, 57.40207), new mp.Vector3(1.001789E-05, -5.008955E-06, 89.97427), false, false); // Гаражная дверь дома id 566
    object.create(-1429437264, new mp.Vector3(-1596.58, -56.81, 57.40207), new mp.Vector3(1.001789E-05, -5.008953E-06, 89.97425), false, false); // Гаражная дверь дома id 566
    object.create(-2045308299, new mp.Vector3(-1591.19, -89.04, 54.54069), new mp.Vector3(0, 0, 0), false, false); // Гаражная дверь дома id 565
    object.create(-42303174, new mp.Vector3(-1588.73, -89.04208, 54.53976), new mp.Vector3(0, 0, 0), false, false); // Гаражная дверь дома id 565
    object.create(1693207013, new mp.Vector3(-1582.3, -86.47108, 54.7), new mp.Vector3(-5.97114E-13, -5.008956E-06, -89.99999), false, false); // Гаражная дверь дома id 565
    object.create(1693207013, new mp.Vector3(-1582.3, -80.98515, 54.7), new mp.Vector3(-1.384231E-12, -5.008955E-06, -89.99998), false, false); // Гаражная дверь дома id 565
    object.create(1301550063, new mp.Vector3(-275.01, 599.8553, 182.1845), new mp.Vector3(0, 0, -2.999996), false, false); // Гаражная дверь дома id 507
    object.create(224975209, new mp.Vector3(-273.2677, 594.1454, 181.8125), new mp.Vector3(1.001791E-05, 5.008956E-06, -2.250036), false, false); // Гаражная дверь дома id 507
    object.create(-1212944997, new mp.Vector3(-178.3, 590.79, 198.58), new mp.Vector3(1.463055E-13, -5.008956E-06, 0.8250271), false, false); // Гаражная дверь дома id 505
    object.create(-493122268, new mp.Vector3(-516.87, 576.36, 121.78), new mp.Vector3(1.001791E-05, 5.008955E-06, -79.4995), false, false); // Гаражная дверь дома id 51
    object.create(-1265404967, new mp.Vector3(-627.86, 524.13, 108.6877), new mp.Vector3(1.001791E-05, -5.008957E-06, 10.27498), false, false); // Гаражная дверь дома id 54
    object.create(-1265404967, new mp.Vector3(-633.4645, 523.1584, 108.6877), new mp.Vector3(1.001791E-05, -5.008956E-06, 10.27498), false, false); // Гаражная дверь дома id 54
    object.create(1991494706, new mp.Vector3(-404.51, 340.59, 109.85), new mp.Vector3(1.001791E-05, 5.008956E-06, 0.3001271), false, false); // Гаражная дверь дома id 31
    object.create(1991494706, new mp.Vector3(-398.32, 340.6257, 109.85), new mp.Vector3(1.001791E-05, 5.008956E-06, 0.3001271), false, false); // Гаражная дверь дома id 31
    object.create(1991494706, new mp.Vector3(-494.29, 743.6877, 164), new mp.Vector3(0, 0, 64.59978), false, false); // Гаражная дверь дома id 154
    object.create(1991494706, new mp.Vector3(-491.65, 749.2623, 164), new mp.Vector3(0, 0, 64.59978), false, false); // Гаражная дверь дома id 154
    object.create(-1857663329, new mp.Vector3(-950.39, 690.71, 154.37), new mp.Vector3(1.001791E-05, -5.008955E-06, 1.275014), false, false); // Гаражная дверь дома id 145
    object.create(1991494706, new mp.Vector3(-1355.44, 499.29, 104.24), new mp.Vector3(1.001791E-05, 5.008956E-06, -64.19965), false, false); // Гаражная дверь дома id 100
    object.create(1991494706, new mp.Vector3(-1352.76, 493.74, 104.24), new mp.Vector3(1.001791E-05, -5.008956E-06, -64.12453), false, false); // Гаражная дверь дома id 100
    object.create(-1265404967, new mp.Vector3(-1109.085, 485.002, 81.15), new mp.Vector3(0, -5.008956E-06, -10.72488), false, false); // Гаражная дверь дома id 87
    object.create(-1265404967, new mp.Vector3(-1114.67, 486.05, 81.15), new mp.Vector3(-1.017777E-13, -5.008956E-06, -10.72488), false, false); // Гаражная дверь дома id 87
    object.create(-1212944997, new mp.Vector3(-976.2, 520.59, 82.35), new mp.Vector3(1.00179E-05, 5.008955E-06, -33.14966), false, false); // Гаражная дверь дома N 2128
    object.create(-1265404967, new mp.Vector3(-708.808, 647.228, 154.1753), new mp.Vector3(1.001791E-05, -5.008956E-06, -11.92505), false, false); // Гаражная дверь дома N 2589
    object.create(-1265404967, new mp.Vector3(-714.3678, 648.3885, 154.1753), new mp.Vector3(1.001791E-05, -5.008956E-06, -11.92505), false, false); // Гаражная дверь дома N 2589
    object.create(1991494706, new mp.Vector3(114.4517, 494.24, 148.32), new mp.Vector3(5.008957E-06, 2.23118E-05, 11), false, false); // Гаражная дверь дома N 3688
    object.create(1991494706, new mp.Vector3(108.64, 493.1, 148.32), new mp.Vector3(5.008957E-06, 2.23118E-05, 11), false, false); // Гаражная дверь дома N 3688

    // Лифты в многоуровневом гараже (dedgarage4)
    object.create(-643813287, new mp.Vector3(-852.52, 284.51, 31.37), new mp.Vector3(1.001779E-05, -5.008956E-06, -54.08999), false, false);
    object.create(-883977292, new mp.Vector3(-852.52, 284.51, 31.37), new mp.Vector3(0, 0, -54.19993), false, false);
    object.create(-643813287, new mp.Vector3(-852.52, 284.51, 26.03), new mp.Vector3(1.001779E-05, -5.008957E-06, -54.08998), false, false);
    object.create(-883977292, new mp.Vector3(-852.52, 284.51, 26.03), new mp.Vector3(0, 0, -54.19992), false, false);
    object.create(-643813287, new mp.Vector3(-852.52, 284.51, 20.68), new mp.Vector3(1.001779E-05, -5.008957E-06, -54.08998), false, false);
    object.create(-883977292, new mp.Vector3(-852.52, 284.51, 20.68), new mp.Vector3(0, 0, -54.19992), false, false);
    object.create(-643813287, new mp.Vector3(-812.17, 314.04, 31.36), new mp.Vector3(1.001779E-05, 5.008955E-06, -53.83999), false, false);
    object.create(-883977292, new mp.Vector3(-812.17, 314.04, 31.36), new mp.Vector3(-2.035555E-13, -5.008955E-06, -53.83999), false, false);
    object.create(-643813287, new mp.Vector3(-812.17, 314.04, 26.03), new mp.Vector3(1.001778E-05, 5.008956E-06, -53.83999), false, false);
    object.create(-883977292, new mp.Vector3(-812.17, 314.04, 26.03), new mp.Vector3(4.07111E-13, -5.008955E-06, -53.83999), false, false);
    object.create(-643813287, new mp.Vector3(-812.17, 314.04, 20.68), new mp.Vector3(1.001778E-05, 5.008956E-06, -53.83999), false, false);
    object.create(-883977292, new mp.Vector3(-812.17, 314.04, 20.68), new mp.Vector3(6.106665E-13, -5.008955E-06, -53.83999), false, false);

// Основной маппинг большого склада Stock
    object.create(-1134789989, new mp.Vector3(1017.13, -3112.86, -37.93), new mp.Vector3(0, 0, 0), false, false, 75);
    object.create(-1134789989, new mp.Vector3(1017.02, -3112.84, -39.7), new mp.Vector3(1.001782E-05, 5.008956E-06, -179.9236), false, false, 76);
    object.create(-1134789989, new mp.Vector3(1017.069, -3112.93, -38.82), new mp.Vector3(0, 0, -87.99982), false, false, 77);
    object.create(-1719363059, new mp.Vector3(1015.624, -3112.88, -39.61), new mp.Vector3(0, 0, 88.89981), false, false, 78);
    object.create(-1719363059, new mp.Vector3(1015.474, -3112.884, -37.84405), new mp.Vector3(1.001786E-05, 5.008956E-06, -91.10022), false, false, 79);
    object.create(-1719363059, new mp.Vector3(1015.85, -3112.89, -38.73), new mp.Vector3(1.001789E-05, -5.008957E-06, -0.02585409), false, false, 80);
    object.create(1089807209, new mp.Vector3(1000.29, -3113.02, -39.26), new mp.Vector3(0, -5.008956E-06, -180), false, false, 81, 1);
    object.create(1089807209, new mp.Vector3(997.3, -3113.02, -39.26), new mp.Vector3(0, -5.008956E-06, -180), false, false, 82, 2);
    object.create(1089807209, new mp.Vector3(998.8, -3113.02, -39.26), new mp.Vector3(0, -5.008956E-06, -180), false, false, 83, 3);
    object.create(-1719363059, new mp.Vector3(1022.705, -3112.87, -39.61), new mp.Vector3(0, 0, 0), false, false, 84);
    object.create(-1719363059, new mp.Vector3(1021.6, -3112.88, -39.61), new mp.Vector3(0, 0, 88.89981), false, false, 85);
    object.create(-1134789989, new mp.Vector3(1022.32, -3112.85, -38.82), new mp.Vector3(0, 0, 0), false, false, 86);
    object.create(-1134789989, new mp.Vector3(1020.97, -3112.93, -38.81), new mp.Vector3(1.001788E-05, 5.008954E-06, -89.29992), false, false, 87);
    object.create(-1134789989, new mp.Vector3(1021.549, -3112.87, -37.92), new mp.Vector3(0, 0, -179.3004), false, false, 88);
    object.create(-1719363059, new mp.Vector3(1022.72, -3112.87, -37.84), new mp.Vector3(1.001785E-05, 5.008956E-06, -91.10022), false, false, 89);
    object.create(-1134789989, new mp.Vector3(1002.95, -3112.97, -39.7), new mp.Vector3(1.001789E-05, -5.008956E-06, 90.14932), false, false, 90);
    object.create(-1719363059, new mp.Vector3(1004.311, -3112.88, -39.61), new mp.Vector3(1.00179E-05, -5.008954E-06, 90.02467), false, false, 91);
    object.create(-1134789989, new mp.Vector3(1004.34, -3112.85, -38.82), new mp.Vector3(1.001784E-05, -5.008956E-06, -179.8241), false, false, 92);
    object.create(-1719363059, new mp.Vector3(1002.91, -3112.88, -38.73), new mp.Vector3(1.00179E-05, 5.008956E-06, 90.09966), false, false, 93);
    object.create(-1134789989, new mp.Vector3(1004.56, -3112.84, -37.93), new mp.Vector3(0, 0, 0), false, false, 94);
    object.create(-1719363059, new mp.Vector3(1003.429, -3112.88, -37.84), new mp.Vector3(1.001791E-05, 5.008956E-06, -179.9513), false, false, 95);

    object.create(-1659828682, new mp.Vector3(1028.12, -3098.818, -38.52463), new mp.Vector3(0, 0, -90.39985), false, false);
    object.create(347760077, new mp.Vector3(1020.728, -3112.954, -38.14285), new mp.Vector3(0, 0, 50.99998), false, false);
    object.create(871161084, new mp.Vector3(1003.608, -3112.99, -39.03433), new mp.Vector3(0, 0, -139.9998), false, false);
    object.create(510965455, new mp.Vector3(1021.668, -3112.962, -39.03433), new mp.Vector3(0, 0, 148.9997), false, false);
    object.create(1611172902, new mp.Vector3(1022.93, -3113.083, -39.03433), new mp.Vector3(0, 0, 29.99998), false, false);
    object.create(1142765633, new mp.Vector3(1004.927, -3112.966, -39.03433), new mp.Vector3(0, 0, 24.99992), false, false);
    object.create(845878493, new mp.Vector3(1005.041, -3112.892, -39.03433), new mp.Vector3(0, 0, 0), false, false);
    object.create(-1653844078, new mp.Vector3(1016.28, -3112.98, -39.99989), new mp.Vector3(0, 0, 0), false, false);
    object.create(347760077, new mp.Vector3(1003.629, -3113.037, -39.9155), new mp.Vector3(0, 0, -30.99997), false, false);
    object.create(347760077, new mp.Vector3(1004.998, -3113.089, -39.9155), new mp.Vector3(0, 0, -161.9997), false, false);
    object.create(347760077, new mp.Vector3(1016.277, -3113.043, -38.14405), new mp.Vector3(0, 0, -142.9996), false, false);
    object.create(-2004926724, new mp.Vector3(1015.198, -3112.973, -39.03553), new mp.Vector3(0, 0, 161.0007), false, false);
    object.create(-1659670616, new mp.Vector3(1016.443, -3113.014, -39.03553), new mp.Vector3(0, 0, -141.9995), false, false);
    object.create(240285960, new mp.Vector3(1015.972, -3113.005, -38.14405), new mp.Vector3(0, 0, -16.99995), false, false);
    object.create(-1951015928, new mp.Vector3(1016.093, -3112.986, -39.9167), new mp.Vector3(0, 0, 25.99999), false, false);
    object.create(-1951015928, new mp.Vector3(1016.302, -3112.981, -39.9167), new mp.Vector3(0, 0, -126.9995), false, false);
    object.create(845878493, new mp.Vector3(1021.48, -3112.859, -39.03433), new mp.Vector3(0, 0, -20.99998), false, false);
    object.create(-1987404681, new mp.Vector3(1022.173, -3113.059, -39.9155), new mp.Vector3(0, 0, -164.9998), false, false);
    object.create(-1458189440, new mp.Vector3(1015.143, -3112.979, -39.9167), new mp.Vector3(0, 0, -15.99995), false, false);
    object.create(-1469896790, new mp.Vector3(1003.389, -3112.796, -39.03433), new mp.Vector3(0, 0, -44.99998), false, false);

    object.delete(1343261146, 996.3063, -3112.344, -39.11191);
    object.delete(-509973344, 992.0818, -3102.724, -38.61679);
    object.delete(1268458364, 994.6763, -3099.17, -39.94958);
    object.delete(176137803, 995.4335, -3100.887, -39.19104);
    object.delete(895484294, 999.1875, -3093.501, -39.99869);
    object.delete(-130812911, 997.8042, -3089.944, -40.00491);
    object.delete(-1738103333, 999.114, -3090.1, -39.56229);
    object.delete(3980350, 998.4703, -3089.788, -38.97379);
    object.delete(2040839490, 1000.234, -3089.944, -39.47586);
    object.delete(1343261146, 996.5288, -3095.898, -39.11191);
    object.delete(38230152, 996.7981, -3097.769, -40.00165);
    object.delete(548760764, 996.5059, -3094.706, -37.40491);
    object.delete(2040839490, 996.5199, -3101.169, -39.47586);
    object.delete(-13720938, 996.5199, -3100.583, -40.00784);
    object.delete(548760764, 1028.243, -3098.224, -36.18852);
    object.delete(-1999230727, 1022.777, -3112.889, -39.04367);
    object.delete(1951313592, 1022.436, -3112.948, -39.7678);
    object.delete(-130812911, 1019.859, -3112.965, -40.00491);
    object.delete(1343261146, 1017.649, -3113.142, -39.11191);
    object.delete(1974409830, 1002.726, -3112.927, -38.84708);
    object.delete(-1890319650, 1002.996, -3113.119, -39.04764);
    object.delete(1005516815, 1004.502, -3112.933, -39.82828);
    object.delete(-1321159957, 1004.091, -3113.066, -39.76736);
    object.delete(-832601639, 1004.868, -3113.002, -39.81144);
    object.delete(-1321159957, 999.9357, -3113.013, -38.00833);
    object.delete(-1134789989, 999.5406, -3112.927, -39.70865);
    object.delete(456071379, 998.1865, -3112.855, -39.08329);
    object.delete(1974409830, 998.2366, -3112.927, -37.9556);
    object.delete(-1853453107, 1022.348, -3090.632, -40.00271);
    object.delete(1298403575, 1024.832, -3089.79, -39.56229);
    object.delete(-1738103333, 1024.25, -3089.946, -39.56229);
    object.delete(-742198632, 993.6818, -3095.474, -40.00269);

    object.delete(572449021, 999.0031, -3113.013, -39.99869);
    object.delete(1350712180, 1001.339, -3111.927, -39.22092);
    object.delete(1350712180, 1020.715, -3090.816, -39.22092);

    // Удалённые объекты на пляжном рынке
    object.delete(1722447695, -1651.426, -812.3784, 9.286438);
    object.delete(-1414692524, -1719.96, -753.6482, 9.298393);
    object.delete(254920799, -1630.439, -790.2651, 10.51931);
    object.delete(-1414692524, -1670.161, -757.679, 9.274288);
    object.delete(-1414692524, -1679.637, -749.8625, 9.201832);
    object.delete(-1414692524, -1689.141, -742.0229, 9.232605);
    object.delete(-1414692524, -1698.427, -733.9775, 9.17775);
    object.delete(-1414692524, -1707.743, -725.9158, 9.141079);
    object.delete(1722447695, -1710.937, -723.3264, 9.121449);
    object.delete(254920799, -1712.405, -724.9124, 10.33788);
    object.delete(-1414692524, -1721.525, -736.0424, 9.298393);
    object.delete(-1414692524, -1729.268, -745.6074, 9.298393);
    object.delete(-1414692524, -1710.612, -761.6642, 9.298393);
    object.delete(-1414692524, -1701.294, -769.6531, 9.298393);
    object.delete(-1414692524, -1691.945, -777.6699, 9.298393);
    object.delete(-1414692524, -1682.632, -785.7361, 9.298393);
    object.delete(-1414692524, -1673.324, -793.7986, 9.298393);
    object.delete(-1414692524, -1663.975, -801.8085, 9.298393);
    object.delete(-1414692524, -1654.568, -809.7322, 9.286438);
    object.delete(1722447695, -1648.245, -814.9832, 9.276375);
    object.delete(-1414692524, -1660.669, -765.5093, 9.006096);
    object.delete(-1414692524, -1650.919, -773.3159, 8.784565);
    object.delete(-1414692524, -1641.382, -781.1859, 9.193226);
    object.delete(1159289407, -1641.373, -781.1926, 8.998985);
    object.delete(1159289407, -1650.926, -773.3104, 8.7103);

// Удалённые объекты на чёрном рынке
    object.delete(1605769687, 725.1302, -924.79, 23.50426);
    object.delete(-188983024, 724.8727, -931.0306, 23.42883);
    object.delete(307713837, 723.8121, -921.0168, 23.47091);
    object.delete(757019157, 723.8858, -919.5078, 23.38545);
    object.delete(757019157, 725.6625, -914.5832, 23.50994);
    object.delete(143291855, 756.7007, -920.1926, 24.54366);

// Удалённые объекты склада 132
    object.delete(-994492850, 902.4158, -1013.453, 33.97011);
    object.delete(-994492850, 902.5475, -1015.997, 33.97608);
    object.delete(1605769687, 896.1475, -1067.998, 31.67726);
    object.delete(-580107888, 896.1216, -1064.029, 31.82788);
    object.delete(666561306, 888.307, -1048.537, 31.84213);
    object.delete(666561306, 906.4517, -1070.152, 31.84213);
    object.delete(218085040, 909.5325, -1070.398, 31.84213);

// Удалённые бизнеса 155
    object.delete(1890640474, -316.1647, -2786.022, 4.001526);

// Удалённые бизнеса 156
    object.delete(1434516869, 1767.732, 3332.262, 40.42291);
    object.delete(-1748303324, 1770.452, 3327.959, 40.35606);
    object.delete(-1919073083, 1773.254, 3327.48, 40.43769);
    object.delete(-946793326, 1768.601, 3335.206, 40.43839);
    object.delete(1917885559, 1766.634, 3333.811, 40.43886);
    object.delete(-2111846380, 1764.836, 3333.107, 40.43758);
    object.delete(-1326111298, 1763.561, 3332.244, 40.43419);
    object.delete(1742634574, 1763.743, 3326.907, 40.44038);
    object.delete(-2111846380, 1763.037, 3325.251, 40.43892);
    object.delete(674546851, 1763.473, 3324.316, 40.39309);
    object.delete(1742374783, 1764.19, 3322.742, 40.4394);
    object.delete(-401310349, 1766.417, 3319.49, 40.33511);

    // Удалённые объекты у Складов
    object.delete(1524671283, 161.2158, -2927.26, 5.12748); // Stock 266
    object.delete(897494494, 160.9235, -2913.135, 5.002159); // Stock 267
    object.delete(-2022916910, 160.9624, -2879.667, 5.008682); // Stock 268
    object.delete(-2022916910, 161.1873, -2878.103, 6.305614); // Stock 268
    object.delete(307713837, 161.3963, -2878.06, 5.107948); // Stock 268
    object.delete(1165008631, 159.0375, -2879.869, 6.243019); // Stock 268
    object.delete(-191836989, 162.8135, -2876.947, 4.99305); // Stock 268
    object.delete(307713837, 161.0776, -2862.33, 5.102982); // Stock 269
    object.delete(-2022916910, 161.0839, -2862.477, 6.300652); // Stock 269
    object.delete(51866064, 161.1701, -2860.711, 5.0019); // Stock 269
    object.delete(-2022916910, 161.0767, -3055.063, 4.984848); // Stock 251
    object.delete(-2022916910, 161.0988, -3058.411, 4.986435); // Stock 251
    object.delete(-58485588, 159.7639, -3147.5, 5.005356); // Stock 249
    object.delete(1165008631, 157.0757, -3253.88, 6.03376); // Stock 246
    object.delete(531440379, 157.3098, -3255.458, 6.032524); // Stock 246
    object.delete(1280771616, 160.7615, -3272.31, 4.987); // Stock 245
    object.delete(1165008631, 157.0759, -3290.441, 6.033428); // Stock 244
    object.delete(531440379, 157.3097, -3292.02, 6.031948); // Stock 244
    object.delete(307713837, 157.6941, -3308.312, 5.11248); // Stock 243
    object.delete(-2022916910, 157.6514, -3308.168, 6.31654); // Stock 243
    object.delete(1165008631, 156.6977, -3306.511, 5.025047); // Stock 243
    object.delete(1923262137, 1050.771, -2414.525, 28.63155); // Stock 18
    object.delete(856312526, 1049.77, -2421.132, 29.30719); // Stock 18
    object.delete(897494494, 1049.146, -2421.495, 29.32722); // Stock 18
    object.delete(218085040, 1049.64, -2423.154, 29.32181); // Stock 18
    object.delete(666561306, 1049.425, -2425.197, 29.3078); // Stock 18
    object.delete(-1187286639, 1048.937, -2429.877, 29.30898); // Stock 18
    object.delete(-58485588, 1048.94, -2431.2, 29.30988); // Stock 18
    object.delete(-994492850, 1049.549, -2429.717, 29.31932); // Stock 18
    object.delete(-994492850, 1049.826, -2426.361, 29.31694); // Stock 18
    object.delete(-2022916910, 1092.043, -2233.912, 29.33582); // Stock 32
    object.delete(1165008631, 1091.902, -2233.757, 30.48395); // Stock 32
    object.delete(1524671283, 1092.899, -2231.866, 29.43689); // Stock 32
    object.delete(-1894042373, 1094.485, -2231.171, 29.27421); // Stock 32
    object.delete(741629727, 1009.621, -2054.605, 30.89452); // Stock 48
    object.delete(1679057497, 1010.029, -2052.875, 30.53959); // Stock 48
    object.delete(-1738103333, 925.1641, -1584.828, 29.77762); // Stock 97
    object.delete(1576342596, 926.061, -1586.127, 29.2942); // Stock 97
    object.delete(666561306, 928.165, -1586.391, 29.27202); // Stock 97
    object.delete(-58485588, 930.3281, -1586.393, 29.27154); // Stock 97
    object.delete(300547451, 923.9932, -1586.04, 30.08851); // Stock 97
    object.delete(-1738103333, 922.3282, -1586.018, 29.78518); // Stock 97
    object.delete(-1738103333, 1001.168, -1537.387, 30.2801); // Stock 109
    object.delete(1935071027, 1002.636, -1537.372, 29.84152); // Stock 109
    object.delete(300547451, 1000.79, -1539.148, 30.60371); // Stock 109
    object.delete(1576342596, 998.3571, -1536.667, 29.8381); // Stock 109
    object.delete(-1738103333, 1003.327, -1539.918, 30.28962); // Stock 109
    object.delete(-1738103333, 999.7537, -1536.195, 30.28068); // Stock 109
    object.delete(830159341, 1001.662, -1535.896, 30.68001); // Stock 109
    object.delete(-2022916910, 729.2911, -1190.415, 23.28482); // Stock 122
    object.delete(1524671283, 730.9893, -1190.664, 23.42249); // Stock 122
    object.delete(1165008631, 729.4171, -1190.242, 24.4309); // Stock 122
    object.delete(-2022916910, 734.1782, -1190.164, 23.27924); // Stock 123
    object.delete(1165008631, 734.8708, -1190.21, 24.4246); // Stock 123
    object.delete(1165008631, 736.4197, -1191.388, 23.27353); // Stock 123
    object.delete(-2022916910, 737.3339, -1190.252, 24.56714); // Stock 123
    object.delete(307713837, 737.4841, -1190.272, 23.36158); // Stock 123
    object.delete(-1853453107, -256.2062, 304.7977, 91.10983); // Stock 342
    object.delete(-1853453107, -258.7368, 304.2122, 91.07887); // Stock 342
    object.delete(740895081, -258.3695, 301.9275, 91.12428,); // Stock 342
    object.delete(143291855, -250.0353, 304.7988, 91.44221); // Stock 344
    object.delete(218085040, 235.8152, 100.023, 92.85185); // Stock 388
    object.delete(1524671283, 493.4144, -585.9753, 23.82936); // Stock 173
    object.delete(-191836989, 494.1568, -578.1782, 23.59377);  // Stock 175
    object.delete(1165008631, 494.0229, -576.7005, 23.58439); // Stock 175
    object.delete(-2022916910, 494.5356, -575.2502, 23.59749); // Stock 175
    object.delete(-188983024, -325.9549, -2464.881, 6.295746); // Stock 230
    object.delete(-188983024, -324.8839, -2466.632, 6.296318); // Stock 230
    object.delete(-188983024, -279.0764, -2468.278, 6.295738); // Stock 236
    object.delete(-188983024, -280.1474, -2466.528, 6.296303); // Stock 236
    object.delete(4088277111, -558.9433, 307.343, 82.29415); // Stock 348
    object.delete(4088277111, -558.6872, 310.0255, 82.25837); // Stock 348
    object.delete(3945129724, -557.6844, 307.3023, 82.29713); // Stock 348
    object.delete(3945129724, -557.4282, 309.9846, 82.25019); // Stock 348
    object.delete(143291855, -558.3568, 311.8253, 82.5661); // Stock 348
    object.delete(1948359883, -557.1702, 311.9332, 82.23843); // Stock 348
    object.delete(897494494, -555.8669, 310.4435, 82.21516); // Stock 348

    object.delete(969847031, -1057.767, -237.484, 43.021); // InvaderDelete
    object.delete(969847031, -1063.842, -240.6464, 43.021); // InvaderDelete

    object.delete(267648181, -72.77863, -682.169, 34.5284); // UnionDepository
    //object.delete(3717863426, 25.06954, -664.5161, 30.98253); // UnionDepository

    object.delete(1215477734, 4987.587, -5718.635, 20.78103); // Ворота Острова Виллы
    object.delete(2720815722, 4990.681, -5715.106, 20.78103); // Ворота Острова Виллы

    // Правительство (Экстерьер)
    object.delete(-2008643115, -1415.269, -532.4758, 30.4776);
    object.delete(-1940238623, -1413.75, -534.4888, 30.38552);
    object.delete(-1940238623, -1417.124, -529.5981, 30.70199);
    object.delete(-1940238623, -1420.439, -524.8185, 30.99145);
    object.delete(-1620823304, -1422.041, -522.8961, 31.06964);
    object.delete(1841929479, -1421.549, -523.3159, 31.04547);
    object.delete(-1940238623, -1423.84, -520.0779, 31.29039);
    object.delete(-1940238623, -1427.236, -515.2849, 31.58356);
    object.delete(-1940238623, -1430.389, -510.6808, 31.86384);
    object.delete(-1940238623, -1433.236, -506.5717, 32.09739);
    object.delete(-1940238623, -1436.525, -501.8381, 32.3909);
    object.delete(-1940238623, -1439.299, -497.7716, 32.62413);
    object.delete(720581693, -1440.444, -493.8069, 32.8087);
    object.delete(1211559620, -1440.487, -492.9063, 32.84278);
    object.delete(-756152956, -1440.572, -492.1226, 32.86752);
    object.delete(-2008643115, -1441.886, -488.9724, 33.06442);
    object.delete(-2007495856, -1433.996, -519.2691, 31.4111);
    object.delete(-1940238623, -1333.575, -485.9554, 32.47874);
    object.delete(-1940238623, -1336.526, -481.6532, 32.51909);
    object.delete(-1940238623, -1340.171, -476.5135, 32.53035);
    object.delete(-1940238623, -1343.716, -471.4368, 32.55862);
    object.delete(-1940238623, -1347.087, -466.6847, 32.64202);
    object.delete(-1940238623, -1350.737, -461.4746, 32.8638);
    object.delete(-1940238623, -1354.211, -456.638, 33.06472);
    object.delete(-1940238623, -1357.757, -451.7688, 33.32761);
    object.delete(-1940238623, -1361.513, -446.5331, 33.69582);
    object.delete(-994492850, -1417.148, -474.3772, 32.66023);
    object.delete(-994492850, -1412.984, -480.8206, 32.57825);
    object.delete(1841929479, -1392.478, -523.8038, 30.20782);
    object.delete(200846641, -1415.855, -490.2801, 32.28891);

// LSPD (Экстерьер)
    object.delete(1805980844, 419.1441, -967.956, 28.44407);
    object.delete(1437508529, 419.0363, -969.7165, 28.42242);
    object.delete(1805980844, 419.1441, -971.5034, 28.44937);
    object.delete(-2007495856, 418.9406, -988.4918, 28.17999);
    object.delete(1805980844, 419.2523, -995.0659, 28.28618);
    object.delete(1805980844, 419.2702, -1004.966, 28.24855);
    object.delete(1805980844, 419.338, -1008.28, 28.26529);
    object.delete(1437508529, 419.2487, -1006.582, 28.23309);
    object.delete(1211559620, 419.2334, -997.7922, 28.21798);
    object.delete(-756152956, 419.2334, -996.756, 28.23951);
    object.delete(1437508529, 419.2458, -993.3654, 28.28894);
    object.delete(-1620823304, 416.3028, -961.5961, 28.44399);
    object.delete(1437508529, 415.4013, -961.6148, 28.46598);
    object.delete(-2007495856, 406.9413, -968.04, 28.46596);
    object.delete(1437508529, 445.3829, -966.1437, 27.85644);
    object.delete(1437508529, 437.7459, -966.0104, 28.10277);
    object.delete(1805980844, 436.1377, -966.1867, 28.15036);
    object.delete(1805980844, 446.9347, -966.0593, 27.79777);
    object.delete(1138027619, 473.1961, -966.0472, 27.09299);
    object.delete(856312526, 471.8073, -965.3984, 26.86329);
    object.delete(-1096777189, 471.0575, -966.1581, 26.89985);
    object.delete(600967813, 467.9193, -966.1756, 27.001);
    object.delete(-1096777189, 463.2997, -966.1774, 27.19584);
    object.delete(1388308576, 462.617, -966.1684, 27.21609);
    object.delete(-2007495856, 472.2478, -970.1152, 26.5803);
    object.delete(856312526, 489.4408, -997.3647, 26.76826);
    object.delete(600967813, 489.7764, -996.1569, 26.7373);
    object.delete(666561306, 489.5108, -998.6524, 26.7871);
    object.delete(1948359883, 489.7737, -1000.65, 26.83446);
    object.delete(856312526, 478.2845, -1017.998, 26.96595);
    object.delete(379532277, 477.1805, -1016.741, 27.31062);
    object.delete(666561306, 480.0718, -1017.32, 26.91727);
    object.delete(856312526, 469.4293, -1027.025, 27.23068);
    object.delete(-2007495856, 473.0369, -1017.74, 27.05297);
    object.delete(-2007495856, 421.3152, -1010.042, 28.01066);
    object.delete(-2007495856, 450.0965, -999.5389, 29.69524);
    object.delete(-2007495856, 457.3095, -1006.358, 27.15059);
    object.delete(1923262137, 412.0218, -1032.441, 28.36854);
    object.delete(1437508529, 410.3891, -1032.776, 28.40844);
    object.delete(1948359883, 408.7373, -1031.787, 28.40162);
    object.delete(-1080006443, 428.4463, -971.6927, 29.701);
    object.delete(-1080006443, 423.5486, -981.4382, 29.69661);
    object.delete(-97646180, 494.0963, -968.2924, 26.44581);

    // Удалённые объекты на LSPD Vespucci
    object.delete(3259306505, -1096.286, -843.0754, 36.69263);
    object.delete(3259306505, -1099.756, -838.7435, 36.71205);
    object.delete(3259306505, -1103.216, -834.4573, 36.69263);
    object.delete(3259306505, -1099.026, -831.1332, 36.69263);
    object.delete(3259306505, -1094.555, -827.525, 36.69263);
    object.delete(3259306505, -1091.169, -831.7278, 36.69263);
    object.delete(3259306505, -1087.625, -836.1431, 36.69263);
    object.delete(3259306505, -1092.096, -839.7513, 36.69263);
    object.delete(1369811908, -1098.724, -822.1707, 26.5504);
    object.delete(1858825521, -1115.27, -844.7075, 13.51289);
    object.delete(1858825521, -1110.1, -850.9946, 13.51289);
    object.delete(4215619686, -1072.916, -851.7467, 3.811821);
    object.delete(4215619686, -1072.209, -851.2354, 3.876984);
    // Временная заглушка для пустых дверей в LSPD Vespucci
    object.create(-1652821467, new mp.Vector3(-1091.34, -834.88, 5.71), new mp.Vector3(1.001789E-05, 5.008956E-06, 127.6486),  false, false);

    //VAGOS
    object.delete(2977731501, -1145.499, -1600.087, 3.383656);

    // Удалённые объекты Auto Repairs Mirror Park
    object.delete(1457658556, 540.9127, -196.6936, 56.65543);
    object.delete(-130812911, 540.4655, -195.571, 53.4962);
    object.delete(-466572284, 551.0168, -203.0785, 53.74287);
    object.delete(-1326111298, 539.5953, -184.4219, 53.47211);
    object.delete(1457658556, 548.601, -202.6248, 58.74928);

// Удалённые объекты Auto Exotics
    object.delete(962420079, 1130.321, -777.3379, 59.76408);
    object.delete(1138027619, 1136.74, -790.1287, 56.87737);
    object.delete(1138027619, 1138.814, -789.9407, 56.87815);
    object.delete(-1681329307, 1140.244, -790.8611, 56.99839);
    object.delete(666561306, 1140.69, -789.5867, 56.60878);

// Удалённые объекты на респавне Bloods
    object.delete(666561306, 820.4344, -2408.858, 22.65858);
    object.delete(740895081, 811.5029, -2399.035, 23.47425);
    object.delete(-1738103333, 809.8354, -2399.853, 23.10304);
    object.delete(1369811908, 811.709, -2388.246, 30.03656);
    object.delete(1165008631, 805.7892, -2377.396, 29.25188);
    object.delete(-2022916910, 805.9994, -2375.721, 29.39366);
    object.delete(307713837, 805.7915, -2375.737, 28.18809);
    object.delete(-2022916910, 805.9387, -2377.544, 28.10595);


// Удалённые объекты на респавне Vagos
    object.delete(897494494, 430.6689, -2032.043, 22.23808);
    object.delete(897494494, 431.8731, -2033.98, 22.27789);
    object.delete(-1096777189, 434.8922, -2039.603, 22.45592);
    object.delete(-994492850, 413.0909, -2055.928, 21.04108);
    object.delete(-994492850, 410.7863, -2054.02, 21.01946);
    object.delete(-994492850, 408.5722, -2052.385, 21.07208);
    object.delete(897494494, 412.1414, -2052.556, 21.10583);
    object.delete(-206690185, 414.248, -2048.448, 21.30726);
    object.delete(897494494, 411.0165, -2062.521, 20.39529);
    object.delete(666561306, 417.7711, -2068.75, 20.50035);
    object.delete(897494494, 416.94, -2069.685, 20.49047);
    object.delete(-1681329307, 416.2596, -2071.178, 20.88758);
    object.delete(666561306, 421.8743, -2061.812, 21.24872);
    object.delete(897494494, 421.5742, -2060.241, 21.31024);
    object.delete(666561306, 422.7481, -2059.713, 21.31829);
    object.delete(1735046030, 421.731, -2059.42, 21.4765);
    object.delete(897494494, 418.6101, -2058.548, 21.18363);
    object.delete(-1211968443, 417.6379, -2057.798, 21.18262);

    // Gang Door
    object.create(-728539053, new mp.Vector3(1332.45, -1659.1, 51.87618), new mp.Vector3(1.001791E-05, -5.008956E-06, -53.42999), false, false); //Гаражная дверь Mara
    object.create(-1635579193, new mp.Vector3(-1135.72, -1591.91, 4.47611), new mp.Vector3(1.001788E-05, 5.008956E-06, 35.05999), false, false); //Входная дверь для Vagos

    // Закрытые окна в гараже неофок
    object.create(-984871726, new mp.Vector3(224.87, 5180.12, -87.53218), new mp.Vector3(16.12494, 5.075419E-06, 89.99923), false, false);

    object.delete(1524671283, 867.6826, -1065.49, 28.02717); // мусор у склада 130
    object.delete(1576342596, 868.6109, -1067.281, 27.91837); // мусор у склада 130
    object.delete(1524671283, 868.1902, -1071.921, 27.96341); // мусор у склада 131
    object.delete(1576342596, 992.3291, -1553.072, 29.75762); // мусор у склада 107
    object.delete(1935071027, 992.4012, -1547.438, 29.77039); // мусор у склада 107
    object.delete(4236481708, 930.6436, -1545.578, 29.86438); // мусор у склада98
    object.delete(4242234993, 930.0823, -1548.232, 30.11697); // мусор у склада 98
    object.delete(897494494, 928.9025, -1545.953, 29.85506); // мусор у склада 98
    object.delete(364445978, 334.8166, 269.0989, 103.104); // мусор у выезда Galaxy

    object.delete(3424098598, 380.6558, 322.8424, 102.5663); // банкомат у Galaxy в 24/7

    //DOORS
    //DOORS
    //DOORS
    //DOORS


    object.openDoor(-1246222793, 256.3116, 220.6579, 106.4296, true); // Банк Взлом
    object.openDoor(961976194, 255.2283, 223.976, 102.3932, true); // Банк Большая

    object.openDoor(1956494919, 266.3624, 217.5697, 110.4328, true); // Банк Отмычка
    object.openDoor(1956494919, 237.7704, 227.87, 106.426, true); // Банк Отмычка
    object.openDoor(1956494919, 256.6172, 206.1522, 110.4328, true); // Банк Отмычка
    object.openDoor(1956494919, 236.5488, 228.3147, 110.4328, true); // Банк Отмычка

    object.openDoor(741314661, 1844.998, 2604.813, 44.63978, true); // Тюремные ворота
    object.openDoor(741314661, 1818.543, 2604.813, 44.611, true); // Тюремные ворота

    // Банки
    object.openDoor(3941780146, -111.48, 6463.94, 31.98499, false); //Блейн Банк
    object.openDoor(2628496933, -109.65, 6462.11, 31.98499, false); //Блейн Банк
    object.openDoor(73386408, -2965.71, 484.2195, 16.0481, false); //Флека Чумаш
    object.openDoor(3142793112, -2965.821, 481.6297, 16.04816, false); //Флека Чумаш
    object.openDoor(73386408, -1213.074, -327.3524, 38.13205, false); //Флека Ричманд
    object.openDoor(3142793112, -1215.386, -328.5237, 38.13211, false); //Флека Ричманд
    object.openDoor(73386408, -348.8109, -47.26213, 49.38759, false); //Флека Бертон
    object.openDoor(3142793112, -351.2598, -46.41221, 49.38765, false); //Флека Бертон
    object.openDoor(73386408, 316.3925, -276.4888, 54.5158, false); //Флека Вайнвуд
    object.openDoor(3142793112, 313.9587, -275.5965, 54.51586, false); //Флека Вайнвуд
    object.openDoor(73386408, 152.0632, -1038.124, 29.71909, false); //Флека ДавнТавн
    object.openDoor(3142793112, 149.6298, -1037.231, 29.71915, false); //Флека ДавнТавн
    object.openDoor(73386408, 1173.903, 2703.613, 38.43904, false); //Флека Гранд Сенора
    object.openDoor(3142793112, 1176.495, 2703.613, 38.43911, false); //Флека Гранд Сенора
    object.openDoor(110411286, 231.5123, 216.5177, 106.4049, false); //Пацифик Главный вход
    object.openDoor(110411286, 232.6054, 214.1584, 106.4049, false); //Пацифик Главный вход
    object.openDoor(110411286, 258.2022, 204.1005, 106.4049, false); //Пацифик Боковой вход
    object.openDoor(110411286, 260.6432, 203.2052, 106.4049, false); //Пацифик Боковой вход
// Магазины одежды и ювилирка
    object.openDoor(868499217, 418.5713, -806.3979, 29.64108, false); //Бинко Текстайл Сити
    object.openDoor(3146141106, 418.5713, -808.674, 29.64108, false); //Бинко Текстайл Сити
    object.openDoor(868499217, -818.7643, -1079.545, 11.47806, false); //Бинко Веспуччи
    object.openDoor(3146141106, -816.7932, -1078.406, 11.47806, false); //Бинко Веспуччи
    object.openDoor(868499217, 82.38156, -1392.752, 29.52609, false); //Дисконт Девис
    object.openDoor(3146141106, 82.38156, -1390.476, 29.52609, false); //Дисконт Девис
    object.openDoor(868499217, -1096.661, 2705.446, 19.25781, false); //Дисконт Лого Занкудо
    object.openDoor(3146141106, -1094.965, 2706.964, 19.25781, false); //Дисконт Лого Занкудо
    object.openDoor(868499217, 1196.825, 2703.221, 38.37257, false); //Дисконт Гранд Сенора
    object.openDoor(3146141106, 1199.101, 2703.221, 38.37257, false); //Дисконт Гранд Сенора
    object.openDoor(868499217, 1686.983, 4821.741, 42.21305, false); //Дисконт Грепсид
    object.openDoor(3146141106, 1687.282, 4819.484, 42.21305, false); //Дисконт Грепсид
    object.openDoor(868499217, -0.05637026, 6517.461, 32.02779, false); //Дисконт Палето-Бей
    object.openDoor(3146141106, -1.725257, 6515.914, 32.02779, false); //Дисконт Палето-Бей
    object.openDoor(1780022985, 617.2458, 2751.022, 42.75777, false); // Сабурбан Хармони
    object.openDoor(1780022985, 127.8201, -211.8274, 55.22751, false); // Сабурбан Хевик
    object.openDoor(1780022985, -1201.435, -776.8566, 17.99184, false); // Сабурбан Дель-Перро
    object.openDoor(1780022985, -3167.75, 1055.536, 21.53288, false); // Сабурбан Каньён Бенкхэм
    object.openDoor(2372686273, -1454.782, -231.7927, 50.05648, false); // Пансонбус Морнингвуд
    object.openDoor(2372686273, -1456.201, -233.3682, 50.05648, false); // Пансонбус Морнингвуд
    object.openDoor(2372686273, -716.6755, -155.42, 37.67493, false); // Пансонбус Рокфорд Хиллс
    object.openDoor(2372686273, -715.6154, -157.2561, 37.67493, false); // Пансонбус Рокфорд Хиллс
    object.openDoor(2372686273, -157.1293, -306.4341, 39.99308, false); // Пансонбус Бертон
    object.openDoor(2372686273, -156.439, -304.4294, 39.99308, false); // Пансонбус Бертон
    object.openDoor(1425919976, -631.9554, -236.3333, 38.20653, false); // Ванжелико
    object.openDoor(9467943, -630.4265, -238.4376, 38.20653, false); // Ванжелико
// Тату Салоны
    object.openDoor(543652229, -1155.454, -1424.008, 5.046147, false); // the pit веспуччи бич
    object.openDoor(543652229, 1321.286, -1650.597, 52.36629, false); // los santos tattoo эль-бурро-хайтс
    object.openDoor(543652229, 321.8085, 178.3599, 103.6782, false); // Blazing Tatto вайнвуд
    object.openDoor(543652229, -3167.789, 1074.867, 20.92086, false); // InkInc Tattoos Каньён Бенкхэм
    object.openDoor(3082015943, -289.1752, 6199.113, 31.63704, false); // Tatto Палето-Бей
    object.openDoor(3082015943, 1859.894, 3749.786, 33.18181, false); // Tatto Сэнди-Шорес
// Барбершопы
    object.openDoor(2450522579, 1932.952, 3725.154, 32.9944, false); // osheas barber Сэнди-Шорес
    object.openDoor(2450522579, -280.7851, 6232.782, 31.84548, false); // herr kutz Палето-Бей
    object.openDoor(2450522579, 1207.873, -470.0363, 66.358, false); // herr kutz Миррор-Парк
    object.openDoor(2450522579, 132.5569, -1710.996, 29.44157, false); // herr kutz Девис
    object.openDoor(2450522579, -1287.857, -1115.742, 7.140073, false); // beachcombover дель-перро
    object.openDoor(2450522579, -29.86917, -148.1571, 57.22648, false); // hair on hawick альта
    object.openDoor(2631455204, -823.2001, -187.0831, 37.81895, false); // bob mulet Рокфорд Хиллс
    object.openDoor(145369505, -822.4442, -188.3924, 37.81895, false); // bob mulet Рокфорд Хиллс
// Бары
    object.openDoor(993120320, -565.1712, 276.6259, 83.28626, false); // tequi-lala главный вход
    object.openDoor(993120320, -561.2866, 293.5044, 87.77851, false); // tequi-lala задний вход
    object.openDoor(190770132, 981.1506, -103.2552, 74.99358, false); // the lost
    object.openDoor(3178925983, 127.9552, -1298.503, 29.41962, false); // vanilla unicorn главный вход
    object.openDoor(668467214, 96.09197, -1284.854, 29.43878, false); // vanilla unicorn задний вход
    object.openDoor(4007304890, 1991.106, 3053.105, 47.36528, false); // yellow jack
// Магазины
    object.openDoor(1196685123, 375.3528, 323.8015, 103.7163, false); // 247 Downtown Vinewood
    object.openDoor(997554217, 377.8753, 323.1672, 103.7163, false); // 247 Downtown Vinewood
    object.openDoor(1196685123, -3240.128, 1003.157, 12.98064, false); // 247 Banham Canyon
    object.openDoor(997554217, -3239.905, 1005.749, 12.98064, false); // 247 Banham Canyon
    object.openDoor(1196685123, -3038.219, 588.2872, 8.058861, false); // 247 Chumash
    object.openDoor(997554217, -3039.012, 590.7642, 8.058861, false); // 247 Chumash
    object.openDoor(1196685123, 1963.917, 3740.075, 32.49369, false); // 247 247 Sandy Shores
    object.openDoor(997554217, 1966.17, 3741.376, 32.49369, false); // 247 Sandy Shores
    object.openDoor(1196685123, 545.504, 2672.745, 42.30644, false); // 247 Harmony
    object.openDoor(997554217, 542.9252, 2672.406, 42.30644, false); // 247 Harmony
    object.openDoor(1196685123, 1730.032, 6412.072, 35.18717, false); // 247 Mount Chiliad
    object.openDoor(997554217, 1732.362, 6410.917, 35.18717, false); // 247 Mount Chiliad
    object.openDoor(1196685123, 2681.292, 3281.427, 55.39108, false); // 247 Grand Senora Desert
    object.openDoor(997554217, 2682.558, 3283.699, 55.39108, false); // 247 Grand Senora Desert
    object.openDoor(1196685123, 27.81761, -1349.169, 29.64696, false); // 247 Strawberry
    object.openDoor(997554217, 30.4186, -1349.169, 29.64696, false); // 247 Strawberry
    object.openDoor(1196685123, 2559.201, 384.0875, 108.7729, false); // 247 Tataviam Mountains
    object.openDoor(997554217, 2559.304, 386.6864, 108.7729, false); // 247 Tataviam Mountains
    object.openDoor(3082015943, 1392.927, 3599.469, 35.13078, false); // Liquor Ace
    object.openDoor(3082015943, 1395.371, 3600.358, 35.13078, false); // Liquor Ace
    object.openDoor(3082015943, -2973.535, 390.1414, 15.18735, false); // Robs Liquor Banham Canyon
    object.openDoor(3082015943, -1490.411, -383.8453, 40.30745, false); // Robs Liquor Morningwood
    object.openDoor(3082015943, 1141.038, -980.3225, 46.55986, false); // Robs Liquor Murrieta Heights
    object.openDoor(3082015943, -1226.894, -903.1218, 12.47039, false); // Robs Liquor Vespucci Canals
    object.openDoor(3082015943, 1167.129, 2703.754, 38.30173, false); // Scoops Liquor Barn
    object.openDoor(3426294393, -53.96112, -1755.717, 29.57094, false); // LTD Gasoline Davis
    object.openDoor(2065277225, -51.96669, -1757.387, 29.57094, false); // LTD Gasoline Davis
    object.openDoor(3426294393, -713.0732, -916.5409, 19.36553, false); // LTD Gasoline Little Seoul
    object.openDoor(2065277225, -710.4722, -916.5372, 19.36553, false); // LTD Gasoline Little Seoul
    object.openDoor(3426294393, 1699.661, 4930.278, 42.21359, false); // LTD Gasoline Grapeseed
    object.openDoor(2065277225, 1698.172, 4928.146, 42.21359, false); // LTD Gasoline Grapeseed
    object.openDoor(3426294393, 1158.364, -326.8165, 69.35503, false); // LTD Gasoline Mirror Park
    object.openDoor(2065277225, 1160.925, -326.3612, 69.35503, false); // LTD Gasoline Mirror Park
    object.openDoor(3426294393, -1823.285, 787.3687, 138.3624, false); // LTD Gasoline Richman Glen
    object.openDoor(2065277225, -1821.369, 789.1274, 138.3124, false); // LTD Gasoline Richman Glen
// Аммунации
    object.openDoor(97297972, 16.12787, -1114.606, 29.94694, false); // GunShop Pillbox
    object.openDoor(4286093708, 18.572, -1115.495, 29.94694, false); // GunShop Pillbox
    object.openDoor(97297972, 244.7275, -44.07911, 70.09098, false); // GunShop Havik
    object.openDoor(4286093708, 243.8379, -46.52324, 70.09098, false); // GunShop Havik
    object.openDoor(97297972, 845.3694, -1024.539, 28.34478, false); // GunShop LaMesa
    object.openDoor(4286093708, 842.7685, -1024.539, 28.34478, false); // GunShop LaMesa
    object.openDoor(97297972, -665.2424, -944.3256, 21.97915, false); // GunShop Seul
    object.openDoor(4286093708, -662.6415, -944.3256, 21.97915, false); // GunShop Seul
    object.openDoor(97297972, -1313.826, -389.1259, 36.84573, false); // GunShop Morningwood
    object.openDoor(4286093708, -1314.465, -391.6472, 36.84573, false); // GunShop Morningwood
    object.openDoor(97297972, 813.1779, -2148.27, 29.76892, false); // GunShop Saipres-Flets
    object.openDoor(4286093708, 810.5769, -2148.27, 29.76892, false); // GunShop Saipres-Flets
    object.openDoor(97297972, 2570.905, 303.3556, 108.8848, false); // GunShop Tataviamskoe
    object.openDoor(4286093708, 2568.304, 303.3556, 108.8848, false); // GunShop Tataviamskoe
    object.openDoor(97297972, -3164.845, 1081.392, 20.98866, false); // GunShop Chumash
    object.openDoor(4286093708, -3163.812, 1083.778, 20.98866, false); // GunShop Chumash
    object.openDoor(97297972, -1114.009, 2689.77, 18.70407, false); // GunShop Zancudo River
    object.openDoor(4286093708, -1112.071, 2691.505, 18.70407, false); // GunShop Zancudo River
    object.openDoor(97297972, 1698.176, 3751.506, 34.85526, false); // GunShop Sandy
    object.openDoor(4286093708, 1699.937, 3753.42, 34.85526, false); // GunShop Sandy
    object.openDoor(97297972, -326.1122, 6075.27, 31.6047, false); // GunShop PaletoBay
    object.openDoor(4286093708, -324.2731, 6077.109, 31.6047, false); // GunShop PaletoBay
// Автомастерские
    object.openDoor(3744620119, -1145.898, -1991.144, 14.18357, false); // Los Santos Customs LSIA
    object.openDoor(3744620119, -356.0905, -134.7714, 40.01295, false); // Los Santos Customs Burton
    object.openDoor(270330101, 723.116, -1088.831, 23.23201, false); // Los Santos Customs La Mesa
    object.openDoor(3472067116, 1182.306, 2645.232, 38.63961, false); // Los Santos Customs Senora
    object.openDoor(3472067116, 1174.654, 2645.222, 38.63961, false); // Los Santos Customs Senora
    object.openDoor(1335311341, 1187.202, 2644.95, 38.55176, false); // Los Santos Customs Senora дверь
    object.openDoor(3867468406, -205.6828, -1310.683, 30.29572, false); // Bennys Original Motor Works
    object.openDoor(4104186511, 484.5642, -1315.574, 30.20331, false); // Beekers Garage
    object.openDoor(3630385052, 482.8112, -1311.953, 29.35057, false); // Beekers Garage дверь
    object.openDoor(2367695858, 500.1746, -1320.543, 28.25339, false); // Beekers Garage ворота перед
    object.openDoor(3472067116, 108.8502, 6617.876, 32.67305, false); // Hayes Autos
    object.openDoor(3472067116, 114.3135, 6623.233, 32.67305, false); // Hayes Autos
    object.openDoor(1335311341, 105.1518, 6614.655, 32.58521, false); // Hayes Autos дверь
// Остальное
    object.openDoor(2059227086, -59.89302, -1092.952, 26.88362, false); //Западная дверь PDM
    object.openDoor(1417577297, -60.54582, -1094.749, 26.88872, false); //Западная дверь PDM
    object.openDoor(2059227086, -39.13366, -1108.218, 26.7198, false); //Южная дверь PDM
    object.openDoor(1417577297, -37.33113, -1108.873, 26.7198, false); //Южная дверь PDM
    object.openDoor(2777093385, 106.3793, -742.6982, 46.18171, false); //Главный вход FIB
    object.openDoor(4204511029, 105.7607, -746.646, 46.18266, false); //Главный вход FIB
    object.openDoor(245182344, 716.7805, -975.4207, 25.00606, false); //Вход на швейную фабрику
    object.openDoor(3613901090, 719.3815, -975.4185, 25.00606, false); //Вход на швейную фабрику
    object.openDoor(2866345169, 1083.547, -1975.435, 31.62222, false); //Дверь литейного завода
    object.openDoor(2866345169, 1065.237, -2006.079, 32.23295, false); //Дверь литейного завода
    object.openDoor(2866345169, 1085.307, -2018.561, 41.62894, false); //Дверь литейного завода
    object.openDoor(2529918806, 1855.685, 3683.93, 34.59282, false); //Дверь Шерифов Сэнди-Шорес
    object.openDoor(2271212864, 1851.249, 3681.846, 34.417, false); //Дверь Шерифов Сэнди-Шорес
    object.openDoor(2271212864, 1849.948, 3684.099, 34.417, false); //Дверь Шерифов Сэнди-Шорес
    object.openDoor(2271212864, 1847.147, 3689.904, 34.417, false); //Дверь Шерифов Сэнди-Шорес
    object.openDoor(2271212864, 1849.4, 3691.204, 34.417, false); //Дверь Шерифов Сэнди-Шорес
    object.openDoor(2271212864, 1857.249, 3690.31, 34.417, false); //Дверь Шерифов Сэнди-Шорес
    object.openDoor(2793810241, -444.4985, 6017.06, 31.86633, false); //Дверь Шерифов Палето-Бей
    object.openDoor(2793810241, -442.66, 6015.222, 31.86633, false); //Дверь Шерифов Палето-Бей
    object.openDoor(2271212864, -440.9874, 6012.765, 31.86633, false); //Дверь Шерифов Палето-Бей
    object.openDoor(2271212864, -442.8268, 6010.925, 31.86633, false); //Дверь Шерифов Палето-Бей
    object.openDoor(2271212864, -447.7092, 6006.717, 31.86633, false); //Дверь Шерифов Палето-Бей
    object.openDoor(2271212864, -449.5486, 6008.556, 31.86633, false); //Дверь Шерифов Палето-Бей
    object.openDoor(2271212864, -450.716, 6016.37, 31.86633, false); //Дверь Шерифов Палето-Бей
    object.openDoor(2615085319, -1083.62, -260.4166, 38.1867, false); //Основные двери LifeInvader
    object.openDoor(3249951925, -1080.974, -259.0203, 38.1867, false); //Основные двери LifeInvader
    object.openDoor(1104171198, -1045.12, -232.004, 39.43794, false); //Задние двери LifeInvader
    object.openDoor(2869895994, -1046.516, -229.3581, 39.43794, false); //Задние двери LifeInvader
    object.openDoor(3954737168, -1042.518, -240.6915, 38.11796, false); //Служебная дверь LifeInvader
    object.openDoor(2795991823, 2509.743, -266.5509, -38.965, false); // Служебная дверь к лестнице в апартаментах Casino
    object.openDoor(725274945, -977.5154, -2837.265, 12.95302, false); // Ворота в аэропорту
    object.openDoor(725274945, -990.2985, -2829.887, 12.94732, false); // Ворота в аэропорту
    object.openDoor(725274945, -1138.472, -2730.446, 12.94986, false); // Ворота в аэропорту
    object.openDoor(725274945, -1151.207, -2723.093, 12.94986, false); // Ворота в аэропорту
    object.openDoor(725274945, -1015.485, -2419.583, 12.95863, false); // Ворота в аэропорту
    object.openDoor(725274945, -1008.071, -2406.751, 12.97701, false); // Ворота в аэропорту
    object.openDoor(569833973, -1213.4, -2079.3, 12.90274, false); // Ворота в аэропорту
    object.openDoor(569833973, -994.4996, -2341.648, 12.94479, false); // Ворота в аэропорту
    object.openDoor(569833973, -984.079, -2348.4, 12.94479, false); // Ворота в аэропорту
    object.openDoor(1286392437, -202.6151, -2515.309, 5.047173, false); // Ворота в порту
    object.openDoor(1286392437, -187.3406, -2515.309, 5.047173, false); // Ворота в порту
    object.openDoor(1286392437, 10.64414, -2542.213, 5.047173, false); // Ворота в порту
    object.openDoor(1286392437, 19.40451, -2529.702, 5.047173, false); // Ворота в порту
    object.openDoor(569833973, 155.318, -2619.044, 5.013092, false); // Ворота в порту
    object.openDoor(569833973, 167.4531, -2619.572, 5.013092, false); // Ворота в порту
    object.openDoor(1286392437, 492.2758, -3115.934, 5.162354, false); // Ворота в порту
    object.openDoor(1286392437, 476.3276, -3115.925, 5.162354, false); // Ворота в порту

    // Закрытые,Удалённые,Открытые ворота у домов
    object.openDoor(703855057, -25.2784, -1431.061, 30.83955, true); // House id 500
    object.openDoor(30769481, -815.2816, 185.975, 72.99993, true); // House id 539
    object.openDoor(67910261, 1972.787, 3824.554, 32.65174, true); // House id 777
    object.openDoor(4268302743, 2333.235, 2574.973, 47.03088, true); // House id 705
    object.openDoor(914592203, 2329.655, 2576.642, 47.03088, true); //  House id 705
    object.openDoor(2052512905, 18.65038, 546.3401, 176.3448, true); //  House id 12
    object.openDoor(1056781042, 175.8408, 477.0768, 142.4736, true); //  House id 14
    object.openDoor(1056781042, 171.3418, 477.9685, 142.4736, true); //  House id 14
    object.openDoor(3379875310, -674.3669, 907.1718, 231.2129, true); //  House id 150
    object.openDoor(3071729699, -1074.653, -1676.134, 4.658443, true); // Гараж на пляже
    object.openDoor(2642145829, -1067.011, -1665.597, 4.789768, true); // Гараж на пляже
    object.openDoor(1013329911, -1064.759, -1668.76, 4.789768, true); // Гараж на пляже
    object.openDoor(913904359, -689.1114, 506.9815, 110.6122, true); // Гараж N2840
    object.openDoor(4030503004, -400.4116, 513.326, 120.5016, true); // Гараж N3583
    object.openDoor(30769481, -966.759, 106.4263, 56.17257, true); // Гараж N4128
    object.openDoor(3450140131, -875.4845, 18.12612, 44.4434, false); // Ворота N4134
    object.openDoor(2169543803, -844.051, 155.9619, 66.03221, false); // Ворота N4110
    object.openDoor(889818406, 1151.06, -1646.344, 36.56644, true); // Гараж N733

    //IntClose
    object.openDoor(132154435, 1972.769, 3815.366, 33.66326, true); // int 1
    object.openDoor(3687927243, -1149.709, -1521.088, 10.78267, true); // int 5
    object.openDoor(520341586, -14.86892, -1441.182, 31.19323, true); // int 7
    object.openDoor(308207762, 7.518359, 539.5268, 176.1776, true); // int 8
    object.openDoor(159994461, -816.716, 179.098, 72.82738, true); // int 9
    object.openDoor(2608952911, -816.1068, 177.5109, 72.82738, true); // int 9
    object.openDoor(2840207166, -796.5657, 177.2214, 73.04045, true); // int 9
    object.openDoor(1245831483, -794.5051, 178.0124, 73.04045, true); // int 9
    object.openDoor(2840207166, -793.3943, 180.5075, 73.04045, true); // int 9
    object.openDoor(1245831483, -794.1853, 182.568, 73.04045, true); // int 9
    object.openDoor(2731327123, -806.2817, 186.0246, 72.62405, true); // int 9
    object.openDoor(2731327123, -777.9761, 322.9964, 212.1467, true); // int 10
    object.openDoor(3636940819, -757.6743, 618.5995, 144.2903, true); // int 11
    object.openDoor(3636940819, -1289.193, 450.2027, 98.04399, true); // int 12
    object.openDoor(3636940819, -793.9415, 324.5879, 217.1877, true); // int 13
    object.openDoor(2607919673, -793.9415, 324.5879, 217.1877, true); // int 13
    object.openDoor(4030239080, -793.9415, 324.5879, 217.1877, true); // int 13
    object.openDoor(1927676967, -793.9415, 324.5879, 217.1877, true); // int 13
    object.openDoor(3108570583, -793.9415, 324.5879, 217.1877, true); // int 13
    object.openDoor(1927676967, -793.9415, 324.5879, 217.1877, true); // int 13
    object.openDoor(330294775, -776.7023, 339.3779, 207.7347, true); // int 14

    //Close Doors
    object.openDoor(486670049, -107.5373, -9.018098, 70.67085, true);
    object.openDoor(3687927243, -1149.709, -1521.088, 10.78267, true);
    object.openDoor(443058963, 1972.51, 3813.948, 32.433, true);
    object.openDoor(1145337974, 1273.815, -1720.697, 54.92143, true);

    object.openDoor(961976194, 255.2283, 223.976, 102.3932, false);

    //Fleeca
    object.openDoor(2703963187, -2956.116, 485.4206, 15.99531, true);
    object.openDoor(2703963187, -1207.328, -335.1289, 38.07925, true);
    object.openDoor(2703963187, -350.4144, -56.79705, 49.3348, true);
    object.openDoor(2703963187, 314.6238, -285.9945, 54.46301, true);
    object.openDoor(2703963187, 150.2913, -1047.629, 29.6663, true);
    object.openDoor(2703963187, 1172.291, 2713.146, 38.38625, true);

    //seval player.call('client:user:changeDoor', [-350.4144, -56.79705, 49.3348, false, 10]);

    const end = new Date().getTime();
    methods.debug('Count Objects Loaded: ' + objectList.length + '  | ' + (end - start) + 'ms');

    timer.createInterval('object.process', object.process, 5000);
};

object.create = function (model, pos, rotation, dynamic, placeOnGround, invType = 0, safe = 0) {
    //if (mp.game.streaming.isModelValid(model)) {
    //mp.game.streaming.requestModel(model);
    objectList.push({model: model, pos: pos, rotation: rotation, dynamic: dynamic, placeOnGround: placeOnGround, isCreate: false, handle: -1, invType: invType, safe: safe});
    //}
};

object.createIpl = function (ipl, pos, radius) {
    mp.game.streaming.removeIpl(ipl);
    iplList.push({ipl: ipl, pos: pos, radius: radius, isLoad: false});
};

object.createEmitter = function (pos) {
    emitterList.push({pos: pos, isLoad: false});
};

object.delete = function (model, x, y, z) {
    objectDelList.push({model: model, x: x, y: y, z: z, isDelete: false});
};

object.deleteMapEditor = function (x, y, z, empty, model, empty2) {
    objectDelList.push({model: model, x: x, y: y, z: z, isDelete: false});
};

object.openDoor = function (hash, x, y, z, isClose = false) {
    doorList.push({hash: hash, x: x, y: y, z: z, isClose: isClose, isLoad: false});
    /*try {
        if (methods.distanceToPos(mp.players.local.position, new mp.Vector3(x, y, z)) < loadDist) {
            mp.game.object.doorControl(hash, x, y, z, isClose, 0.0, 50.0, 0);
            if (isClose == true)
                mp.game.invoke(methods.FREEZE_ENTITY_POSITION, mp.game.object.getClosestObjectOfType(x, y, z, 1, hash, false, false, false));
        }
    }
    catch (e) {
        methods.debug(e);
    }*/
};

object.changeDoor = function (x, y, z, isClose = false, distChecker = 10) {

    try {
        let door = {};
        let id = -1;
        doorList.forEach((item, idx) => {
            let dist = methods.distanceToPos(mp.players.local.position, new mp.Vector3(item.x, item.y, item.z));
            if (dist < distChecker) {
                door = item;
                id = idx;
            }
        });

        if (door && id >= 0) {
            door.x = x;
            door.y = y;
            door.z = z;
            door.isClose = isClose;
            door.isLoad = false;
            doorList[id] = door;

            if (methods.distanceToPos(mp.players.local.position, new mp.Vector3(x, y, z)) < distChecker) {
                mp.game.object.doorControl(door.hash, x, y, z, isClose, 0.0, 50.0, 0);
                if (isClose)
                    mp.game.invoke(methods.FREEZE_ENTITY_POSITION, mp.game.object.getClosestObjectOfType(x, y, z, distChecker, door.hash, false, false, false));
            }
        }
    }
    catch (e) {}
};

object.process = function () {

    if (!user.isLogin())
        return;

    try {
        let playerPos = mp.players.local.position;

        objectDelList.forEach(item => {
            try {
                let dist = methods.distanceToPos(playerPos, new mp.Vector3(item.x, item.y, item.z));
                if (dist < loadDist && !item.isDelete) {
                    mp.game.entity.createModelHide(item.x, item.y, item.z, 2, item.model, true);
                    item.isDelete = true;
                }
                else if (dist > loadDist + 50 && item.isDelete) {
                    item.isDelete = false;
                }
            }
            catch (e) {
                methods.debug(e);
            }
        });

        iplList.forEach(item => {
            try {
                let dist = methods.distanceToPos(playerPos, item.pos);
                let radius = item.radius;
                if (dist < radius && !item.isLoad) {
                    mp.game.streaming.requestIpl(item.ipl);
                    item.isLoad = true;
                }
                else if (dist > radius + 50 && item.isLoad) {
                    mp.game.streaming.removeIpl(item.ipl);
                    item.isLoad = false;
                }
            }
            catch (e) {
                methods.debug(e);
            }
        });

        emitterList.forEach(item => {
            try {
                let dist = methods.distanceToPos(playerPos, item.pos);
                let radius = 100;
                if (dist < radius && !item.isLoad) {
                    item.handle = mp.objects.new(mp.game.joaat('prop_boombox_01'), item.pos,
                        {
                            rotation: new mp.Vector3(0,0,0),
                            alpha: 0,
                            dimension: -1
                        });
                    mp.game.invoke('0x651D3228960D08AF', "SE_Script_Placed_Prop_Emitter_Boombox", item.handle.handle);
                    mp.game.audio.setEmitterRadioStation("SE_Script_Placed_Prop_Emitter_Boombox", mp.game.audio.getRadioStationName(20)); //TODO 18
                    mp.game.audio.setStaticEmitterEnabled("SE_Script_Placed_Prop_Emitter_Boombox", true);

                    /*mp.game.invoke('0x651D3228960D08AF', "SE_Script_Placed_Prop_Emitter_Boombox", mp.players.local.handle);
                    mp.game.audio.setEmitterRadioStation("SE_Script_Placed_Prop_Emitter_Boombox", mp.game.audio.getRadioStationName(1));
                    mp.game.audio.setStaticEmitterEnabled("SE_Script_Placed_Prop_Emitter_Boombox", true);*/

                    item.isLoad = true;
                }
                else if (dist > radius + 50 && item.isLoad) {
                    if (mp.objects.exists(item.handle)) {
                        item.handle.destroy();
                        item.handle = -1;
                    }
                    item.isLoad = false;
                }
            }
            catch (e) {
                methods.debug(e);
            }
        });

        doorList.forEach(item => {
            try {
                let dist = methods.distanceToPos(playerPos, new mp.Vector3(item.x, item.y, item.z));
                if (dist < 20 && !item.isLoad) {
                    mp.game.object.doorControl(item.hash, item.x, item.y, item.z, item.isClose, 0.0, 50.0, 0);
                    if (item.isClose)
                        mp.game.invoke(methods.FREEZE_ENTITY_POSITION, mp.game.object.getClosestObjectOfType(item.x, item.y, item.z, 1, item.hash, false, false, false));
                    item.isLoad = true;
                }
                else if (dist > 30 && item.isLoad) {
                    item.isLoad = false;
                }
            }
            catch (e) {
                methods.debug(e);
            }
        });

        objectList.forEach(async function(item) {
            let dist = methods.distanceToPos2D(playerPos, item.pos);
            if (dist < loadDist && !item.isCreate) {
                try {
                    if (mp.game.streaming.hasModelLoaded(item.model)) {
                        item.handle = mp.objects.new(item.model, item.pos,
                            {
                                rotation: item.rotation,
                                alpha: 255,
                                dimension: -1
                            });
                        if (item.invType > 0)
                            item.handle.invType = item.invType;
                        if (item.safe > 0)
                            item.handle.safe = item.safe;
                        item.isCreate = true;
                    }
                    else if(item.didRequest !== true) {
                        item.didRequest = true;
                        mp.game.streaming.requestModel(item.model);
                    }
                }
                catch (e) {
                    methods.debug(`Exeption: objectList.forEach.create`);
                    methods.debug(e);
                }
            }
            else if (dist > loadDist + 50 && item.isCreate) {
                try {
                    if (mp.objects.exists(item.handle)) {
                        item.handle.destroy();
                        item.handle = -1;
                        item.isCreate = false;
                    }

                    if(item.didRequest === true) {
                        item.didRequest = false;
                        mp.game.streaming.setModelAsNoLongerNeeded(item.model);
                    }
                }
                catch (e) {
                    methods.debug(`Exeption: objectList.forEach.destroy`);
                    methods.debug(e);
                }
            }
        });
    }
    catch (e) {}
};

export default object;