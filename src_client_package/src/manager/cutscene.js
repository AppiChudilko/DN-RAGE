import user from '../user';
import npc from "./npc";

import methods from "../modules/methods";

let cutscene = {};

let vehiclesPool = [];

let scenes = {
    islandClub: {
        pos: new mp.Vector3(4859.0341796875, -4926.43212890625, 5.304588317871094),
        rot: new mp.Vector3(-1.8375024795532227, 5.338830533219152e-8, -114.02210998535156),
        vehList: [],
        loadNpc: () => {
            let dim = mp.players.local.remoteId + 1;
            npc.create(mp.game.joaat("a_f_m_beach_01"), new mp.Vector3(4893.2724609375, -4928.31884765625, 3.361629009246826), 331.41070556640625, dim, '', 'misschinese2_crystalmazemcs1_ig', 'dance_loop_tao', 9, 0);
            npc.create(mp.game.joaat("u_m_y_babyd"), new mp.Vector3(4895.09228515625, -4927.42138671875, 3.3612160682678223), 51.3140869140625, dim, '', 'timetable@tracy@ig_5@idle_a', 'idle_a', 9, 0);
            npc.create(mp.game.joaat("s_f_y_baywatch_01"), new mp.Vector3(4893.2890625, -4925.99072265625, 3.36201548576355), 144.31817626953125, dim, '', 'misscarsteal4@toilet', 'desperate_toilet_idle_a', 9, 0);
            npc.create(mp.game.joaat("s_m_y_baywatch_01"), new mp.Vector3(4891.21337890625, -4926.3662109375, 3.366328239440918), 244.714111328125, dim, '', 'anim@amb@nightclub@dancers@crowddance_facedj@hi_intensity', 'hi_dance_facedj_09_v2_male^6', 9, 0);
            npc.create(mp.game.joaat("a_f_y_beach_01"), new mp.Vector3(4891.3046875, -4928.17431640625, 3.3664605617523193), 236.3068389892578, dim, '', 'anim@amb@nightclub@dancers@crowddance_facedj@low_intesnsity', 'li_dance_facedj_09_v1_male^6', 9, 0);
            npc.create(mp.game.joaat("a_m_m_beach_01"), new mp.Vector3(4891.8876953125, -4924.65380859375, 3.3667640686035156), 193.02442932128906, dim, '', 'anim@amb@nightclub@dancers@crowddance_facedj_transitions@from_hi_intensity', 'trans_dance_facedj_hi_to_li_09_v1_male^6', 9, 0);
            npc.create(mp.game.joaat("a_m_o_beach_01"), new mp.Vector3(4893.5771484375, -4923.96484375, 3.367577075958252), 309.57366943359375, dim, '', 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity', 'hi_dance_crowd_13_v2_male^6', 9, 0);
            npc.create(mp.game.joaat("a_m_y_beach_01"), new mp.Vector3(4894.55126953125, -4923.49951171875, 3.362168550491333), 144.22816467285156, dim, '', 'anim@amb@nightclub@dancers@crowddance_single_props@hi_intensity', 'hi_dance_prop_13_v1_male^6', 9, 0);
            npc.create(mp.game.joaat("a_m_m_beach_02"), new mp.Vector3(4895.3623046875, -4925.05810546875, 3.3615822792053223), 248.77725219726562, dim, '', 'anim@amb@nightclub@mini@dance@dance_solo@male@var_a@', 'med_center_up', 9, 0);
            npc.create(mp.game.joaat("a_m_y_beach_02"), new mp.Vector3(4891.11083984375, -4922.52099609375, 3.3681764602661133), 250.46063232421875, dim, '', 'anim@amb@nightclub@mini@dance@dance_solo@male@var_a@', 'med_right_up', 9, 0);
            npc.create(mp.game.joaat("a_m_y_beach_02"), new mp.Vector3(4890.61767578125, -4924.04052734375, 3.3676912784576416), 131.23297119140625, dim, '', 'timetable@tracy@ig_5@idle_b', 'idle_e', 9, 0);
            npc.create(mp.game.joaat("a_m_y_beachvesp_02"), new mp.Vector3(4888.56103515625, -4925.419921875, 3.3690054416656494), 289.7685852050781, dim, '', 'mini@strip_club@idles@dj@idle_04', 'idle_04', 9, 0);
            npc.create(mp.game.joaat("a_m_y_breakdance_01"), new mp.Vector3(4888.61083984375, -4928.36083984375, 3.363665819168091), 1.5099296569824219, dim, '', 'special_ped@mountain_dancer@monologue_3@monologue_3a', 'mnt_dnc_buttwag', 9, 0);
            npc.create(mp.game.joaat("s_m_o_busker_01"), new mp.Vector3(4886.662109375, -4928.0009765625, 3.3689966201782227), 285.0208435058594, dim, '', 'anim@amb@nightclub@dancers@black_madonna_entourage@', 'hi_dance_facedj_09_v2_male^5', 9, 0);
            npc.create(mp.game.joaat("a_f_m_fatcult_01"), new mp.Vector3(4888.34912109375, -4927.02587890625, 3.3732316493988037), 192.22988891601562, dim, '', 'anim@amb@nightclub@dancers@crowddance_single_props@', 'hi_dance_prop_09_v1_male^6', 9, 0);
            npc.create(mp.game.joaat("a_m_y_jetski_01"), new mp.Vector3(4888.33251953125, -4923.09228515625, 3.371128797531128), 250.23037719726562, dim, '', 'anim@mp_player_intcelebrationfemale@uncle_disco', 'uncle_disco', 9, 0);
            npc.create(mp.game.joaat("a_f_y_juggalo_01"), new mp.Vector3(4893.0068359375, -4921.0517578125, 3.3724451065063477), 197.61224365234375, dim, '', 'anim@mp_player_intcelebrationfemale@raise_the_roof', 'raise_the_roof', 9, 0);
            npc.create(mp.game.joaat("a_m_y_methhead_01"), new mp.Vector3(4892.1416015625, -4930.8388671875, 3.366591691970825), 47.505645751953125, dim, '', 'anim@mp_player_intcelebrationmale@cats_cradle', 'cats_cradle', 9, 0);
            npc.create(mp.game.joaat("a_m_y_musclbeac_01"), new mp.Vector3(4890.11962890625, -4930.455078125, 3.3754429817199707), 262.12408447265625, dim, '', 'anim@amb@nightclub@mini@dance@dance_solo@female@var_a@', 'high_center', 9, 0);
            npc.create(mp.game.joaat("a_m_y_musclbeac_02"), new mp.Vector3(4895.34521484375, -4931.19091796875, 3.367696762084961), 0.37757450342178345, dim, '', 'anim@amb@nightclub@mini@dance@dance_solo@female@var_b@', 'high_center', 9, 0);
            npc.create(mp.game.joaat("ig_tracydisanto"), new mp.Vector3(4895.736328125, -4929.66796875, 3.3709402084350586), 139.65628051757812, dim, '', 'anim@amb@nightclub@mini@dance@dance_solo@male@var_b@', 'high_center', 9, 0);
            npc.create(mp.game.joaat("a_f_y_topless_01"), new mp.Vector3(4867.7626953125, -4939.55322265625, 2.4635419845581055), 330.4847717285156, dim, '', 'amb@world_human_sunbathe@male@back@base', 'base', 9, 0);
            npc.create(mp.game.joaat("ig_tylerdix"), new mp.Vector3(4877.630859375, -4934.54931640625, 3.4400932788848877), 63.696189880371094, dim, '', 'amb@world_human_leaning@male@wall@back@legs_crossed@idle_a', 'idle_a', 9, 0);
            npc.create(mp.game.joaat("a_m_y_yoga_01"), new mp.Vector3(4868.55322265625, -4932.39013671875, 2.449154853820801), 74.1982650756836, dim, '', 'anim@amb@business@bgen@bgen_no_work@', 'sit_phone_phoneputdown_idle_nowork', 9, 0);
            npc.create(mp.game.joaat("a_f_y_beach_02"), new mp.Vector3(4895.52685546875, -4952.44189453125, 3.373162031173706), 47.28517532348633, dim, '', 'amb@world_human_stupor@male_looking_right@base', 'base', 9, 0);
            npc.create(mp.game.joaat("a_m_o_beach_02"), new mp.Vector3(4903.26708984375, -4943.05322265625, 3.3947694301605225), 43.597347259521484, dim, '', 'rcmme_amanda1', 'stand_loop_cop', 9, 0);
        }
    },
    islandVilla: {
        pos: new mp.Vector3(5068.18798828125, -5780.14453125, 17.01439094543457),
        rot: new mp.Vector3(0.29037585854530334, 6.67019151023851e-9, 70.26126098632812),
        vehList: [],
        loadNpc: () => {
            let dim = mp.players.local.remoteId + 1;
            npc.create(mp.game.joaat("a_f_y_beach_01"), new mp.Vector3(5062.44482421875, -5782.251953125, 16.647676467895508), 45.42502975463867, dim, '', 'amb@world_human_sunbathe@male@back@base', 'base', 9, 0);
            npc.create(mp.game.joaat("a_f_y_topless_01"), new mp.Vector3(5060.08447265625, -5776.75439453125, 16.277053833007812), 41.66874313354492, dim, '', 'anim@amb@business@bgen@bgen_no_work@', 'sit_phone_phoneputdown_idle_nowork', 9, 0);
            npc.create(mp.game.joaat("a_m_m_beach_01"), new mp.Vector3(5051.06201171875, -5782.04296875, 16.277055740356445), 314.54345703125, dim, '', 'amb@world_human_leaning@male@wall@back@foot_up@idle_b', 'idle_d', 9, 0);
            npc.create(mp.game.joaat("a_f_y_beach_02"), new mp.Vector3(5050.32470703125, -5781.396484375, 16.27705192565918), 319.8518371582031, dim, '', 'amb@world_human_leaning@male@wall@back@legs_crossed@idle_a', 'idle_a', 9, 0);
            npc.create(mp.game.joaat("s_f_y_baywatch_01"), new mp.Vector3(5049.6650390625, -5772.3876953125, 16.64899444580078), 223.97149658203125, dim, '', 'anim@amb@business@bgen@bgen_no_work@', 'sit_phone_phoneputdown_idle_nowork', 9, 0);
            npc.create(mp.game.joaat("a_m_y_beach_04"), new mp.Vector3(5048.564453125, -5773.50634765625, 16.647798538208008), 53.56141662597656, dim, '', 'amb@world_human_sunbathe@male@back@base', 'base', 9, 0);
            npc.create(mp.game.joaat("a_m_o_beach_02"), new mp.Vector3(5053.08642578125, -5771.978515625, 16.277118682861328), 174.15504455566406, dim, 'WORLD_HUMAN_SMOKING', '', '', 0, 0);
            npc.create(mp.game.joaat("a_f_y_juggalo_01"), new mp.Vector3(5047.51708984375, -5778.234375, 16.276893615722656), 314.12774658203125, dim, 'WORLD_HUMAN_AA_COFFEE', '', '', 0, 0);
            npc.create(mp.game.joaat("g_m_m_cartelguards_02"), new mp.Vector3(5042.51708984375, -5791.7607421875, 17.476266860961914), 219.87033081054688, dim, '', 'missfbi4mcs_2', 'loop_sec_b', 9, 0);

        }
    },
    islandTurist: {
        pos: new mp.Vector3(5223.232421875, -5397.9931640625, 67.5654525756836),
        rot: new mp.Vector3(0.7321267127990723, 2.6682597464855462e-8, 29.930280685424805),
        vehList: [],
        loadNpc: () => {
            let dim = mp.players.local.remoteId + 1;
            npc.create(mp.game.joaat("a_f_y_tourist_01"), new mp.Vector3(5220.48828125, -5394.5498046875, 67.51779174804688), 291.80755615234375, dim, '', 'anim@amb@business@bgen@bgen_no_work@', 'sit_phone_phoneputdown_idle_nowork', 9, 0);
            npc.create(mp.game.joaat("csb_englishdave_02"), new mp.Vector3(5220.31982421875, -5393.42138671875, 67.43941497802734), 245.93975830078125, dim, '', 'anim@amb@business@bgen@bgen_no_work@', 'sit_phone_phoneputdown_idle_nowork', 9, 0);

        }
    },
    losSantosPolice: {
        pos: new mp.Vector3(259.32427978515625, -1964.3709716796875, 23.433238983154297),
        rot: new mp.Vector3(0.5270015597343445, 2.6681551190677055e-8, -60.92049026489258),
        vehList: [
            ["Ambulance", 268.92791748046875, -1954.991943359375, 23.552268981933594, 313.0314025878906, true, 111],
            ["Police2", 258.8928527832031, -1959.97412109375, 22.57894515991211, 173.080810546875, true, 111],
            ["Police3", 255.65162658691406, -1962.8681640625, 22.537006378173828, 229.13453674316406, true, 111],
            ["Police", 262.55230712890625, -1959.600341796875, 22.786836624145508, 262.90924072265625, true, 111],
            ["Police", 277.5348205566406, -1949.887451171875, 23.687360763549805, 251.19244384765625, true, 111],
        ],
        loadNpc: () => {
            let dim = mp.players.local.remoteId + 1;
            npc.create(mp.game.joaat("a_m_y_soucent_03"), new mp.Vector3(266.77642822265625, -1964.5933837890625, 22.98975372314453), 40.12643814086914, dim, '', 'amb@world_human_stupor@male_looking_right@base', 'base', 9, 0);
            npc.create(mp.game.joaat("s_m_m_paramedic_01"), new mp.Vector3(266.9861145019531, -1964.0166015625, 22.999195098876953), 177.53558349609375, dim, '', 'amb@medic@standing@kneel@base', 'base', 9, 0);
            npc.create(mp.game.joaat("s_m_y_cop_01"), new mp.Vector3(259.7757873535156, -1962.8878173828125, 22.76807975769043), 215.5308074951172, dim, 'WORLD_HUMAN_SMOKING', '', '', 0, 0);
            npc.create(mp.game.joaat("s_f_y_cop_01"), new mp.Vector3(279.6746826171875, -1949.3482666015625, 24.11888313293457), 332.9941101074219, dim, '', 'amb@world_human_leaning@male@wall@back@legs_crossed@idle_a', 'idle_a', 9, 0);
            npc.create(mp.game.joaat("s_m_y_cop_01"), new mp.Vector3(273.35723876953125, -1958.1214599609375, 23.526954650878906), 46.5958137512207, dim, '', 'anim@amb@business@bgen@bgen_no_work@', 'stand_phone_phoneputdown_idle_nowork', 9, 0);
            npc.create(mp.game.joaat("s_f_y_cop_01"), new mp.Vector3(266.3013610839844, -1965.9752197265625, 22.791488647460938), 29.125322341918945, dim, 'CODE_HUMAN_MEDIC_TIME_OF_DEATH', '', '', 0, 0);
        }
    },
    fishing: {
        pos: new mp.Vector3(-3422.62939453125, 953.3683471679688, 8.962787628173828),
        rot: new mp.Vector3(0.8863410949707031, 2.6683618870038117e-8, -140.80770874023438),
        vehList: [],
        loadNpc: () => {
            let dim = mp.players.local.remoteId + 1;
            npc.create(mp.game.joaat("s_m_y_grip_01"), new mp.Vector3(-3418.578857421875, 951.7764282226562, 8.346691131591797), 179.24514770507812, dim, 'WORLD_HUMAN_STAND_FISHING', '', '', 0, 0);
            npc.create(mp.game.joaat("ig_jimmyboston"), new mp.Vector3(-3419.685546875, 951.7174682617188, 8.346691131591797), 176.77439880371094, dim, 'WORLD_HUMAN_SMOKING', '', '', 0, 0);

        }
    },
    mirrorPark: {
        pos: new mp.Vector3(1085.131591796875, -689.3108520507812, 59.3423957824707),
        rot: new mp.Vector3(-1.1982338428497314, -1.667891491585749e-9, 90.85181427001953),
        vehList: [],
        loadNpc: () => {
            let dim = mp.players.local.remoteId + 1;
            npc.create(mp.game.joaat("a_m_y_yoga_01"), new mp.Vector3(1079.961669921875, -687.4596557617188, 57.616172790527344), 100.02781677246094, dim, 'WORLD_HUMAN_YOGA');
            npc.create(mp.game.joaat("a_f_y_yoga_01"), new mp.Vector3(1077.0902099609375, -687.4829711914062, 57.5738410949707), 268.98309326171875, dim, 'WORLD_HUMAN_YOGA');
            npc.create(mp.game.joaat("a_f_y_tennis_01"), new mp.Vector3(1075.917236328125, -689.3651123046875, 57.55933380126953), 277.50433349609375, dim, 'WORLD_HUMAN_YOGA');
            npc.create(mp.game.joaat("ig_patricia"), new mp.Vector3(1076.95068359375, -685.0914306640625, 57.667762756347656), 239.958251953125, dim, 'WORLD_HUMAN_YOGA');
            npc.create(mp.game.joaat("a_f_y_fitness_02"), new mp.Vector3(1074.741943359375, -686.3609008789062, 57.64474868774414), 262.405517578125, dim, 'WORLD_HUMAN_YOGA');
            npc.create(mp.game.joaat("s_f_m_fembarber"), new mp.Vector3(1077.5166015625, -694.5809326171875, 57.813961029052734), 357.7379455566406, dim, '', 'anim@amb@business@bgen@bgen_no_work@', 'sit_phone_phoneputdown_idle_nowork', 9, 0);
            npc.create(mp.game.joaat("a_m_y_eastsa_02"), new mp.Vector3(1075.9876708984375, -693.4752807617188, 57.61756134033203), 156.16017150878906, dim, '', 'amb@world_human_sunbathe@male@back@base', 'base', 9, 0);
            npc.create(mp.game.joaat("mp_f_execpa_01"), new mp.Vector3(1047.533203125, -691.25244140625, 56.75139617919922), 27.296140670776367, dim, '', 'amb@world_human_jog_standing@female@idle_a', 'idle_a', 9, 0);
            npc.create(mp.game.joaat("csb_denise_friend"), new mp.Vector3(1055.5538330078125, -705.8883666992188, 56.71515655517578), 293.0299987792969, dim, '', 'amb@code_human_police_investigate@base', 'base', 9, 0);
            npc.create(mp.game.joaat("a_c_rabbit_01"), new mp.Vector3(1069.5802001953125, -686.6519775390625, 57.00240173339844), 224.9828338623047, dim, '');

        }
    },
    turistWater: {
        pos: new mp.Vector3(-1578.615234375, 2102.496337890625, 68.938232421875),
        rot: new mp.Vector3(-0.1271425038576126, 3.3350615602500966e-9, 107.36141204833984),
        vehList: [
            ["Mesa", -1584.752197265625, 2096.95458984375, 68.36341094970703, 18.239288330078125]
        ],
        loadNpc: () => {
            let dim = mp.players.local.remoteId + 1;
            npc.create(mp.game.joaat("a_m_y_beach_01"), new mp.Vector3(-1585.21875, 2103.217041015625, 67.7760009765625), 107.591552734375, dim, 'WORLD_HUMAN_PAPARAZZI');
            npc.create(mp.game.joaat("ig_oldrichguy"), new mp.Vector3(-1583.9556884765625, 2098.338134765625, 68.57637023925781), 293.35113525390625, dim, '', 'anim@amb@business@bgen@bgen_no_work@', 'stand_phone_phoneputdown_idle_nowork', 9, 0);
            npc.create(mp.game.joaat("ig_money"), new mp.Vector3(-1582.2232666015625, 2097.993408203125, 68.63856506347656), 52.69978332519531, dim, 'WORLD_HUMAN_TOURIST_MAP');

        }
    },
    bitchTrash: {
        pos: new mp.Vector3(151.75051879882812, -1191.0848388671875, 30.140644073486328),
        rot: new mp.Vector3(-2.3851938247680664, 0, 149.9725799560547),
        vehList: [],
        loadNpc: () => {
            let dim = mp.players.local.remoteId + 1;
            npc.create(mp.game.joaat("a_m_m_eastsa_01"), new mp.Vector3(144.37022399902344, -1193.5504150390625, 29.644935607910156), 197.03135681152344, dim, '', 'amb@world_human_bum_slumped@male@laying_on_right_side@base', 'base', 9, 0);
            npc.create(mp.game.joaat("u_m_m_aldinapoli"), new mp.Vector3(144.7971649169922, -1195.153076171875, 29.32789421081543), 269.3960876464844, dim, '', 'amb@world_human_stupor@male_looking_right@base', 'base', 9, 0);
            npc.create(mp.game.joaat("s_m_m_cntrybar_01"), new mp.Vector3(152.7506103515625, -1198.924072265625, 29.295076370239258), 273.306396484375, dim, '', 'amb@world_human_bum_wash@male@high@idle_a', 'idle_a', 9, 0);
            npc.create(mp.game.joaat("a_m_m_eastsa_01"), new mp.Vector3(146.6430206298828, -1201.3997802734375, 29.295074462890625), 353.32781982421875, dim, '', 'anim@amb@business@bgen@bgen_no_work@', 'stand_phone_phoneputdown_idle_nowork', 9, 0);
            npc.create(mp.game.joaat("ig_claypain"), new mp.Vector3(145.7727508544922, -1200.9532470703125, 29.298141479492188), 319.7944641113281, dim, 'WORLD_HUMAN_DRUG_DEALER');

        }
    },
    vinewoodParty: {
        pos: new mp.Vector3(-669.5354614257812, 856.2507934570312, 227.46221923828125),
        rot: new mp.Vector3(-5.099081516265869, 0, -173.17813110351562),
        vehList: [],
        loadNpc: () => {
            let dim = mp.players.local.remoteId + 1;
            npc.create(mp.game.joaat("a_f_y_bevhills_01"), new mp.Vector3(-669.0864868164062, 842.9957275390625, 225.0524444580078), 33.27382278442383, dim, '', 'anim@amb@business@bgen@bgen_no_work@', 'stand_phone_phoneputdown_idle_nowork', 9, 0);
            npc.create(mp.game.joaat("a_m_y_bevhills_01"), new mp.Vector3(-669.651123046875, 843.7443237304688, 225.0524444580078), 218.25323486328125, dim, '', 'amb@code_human_police_investigate@base', 'base', 9, 0);
            npc.create(mp.game.joaat("ig_g"), new mp.Vector3(-675.1823120117188, 844.8566284179688, 225.05245971679688), 323.9393005371094, dim, '', 'amb@world_human_leaning@male@wall@back@foot_up@idle_b', 'idle_d', 9, 0);
            npc.create(mp.game.joaat("ig_jackie"), new mp.Vector3(-674.3125610351562, 844.8156127929688, 225.05245971679688), 55.85884475708008, dim, '', 'rcmme_amanda1', 'stand_loop_cop', 9, 0);
            npc.create(mp.game.joaat("a_f_y_clubcust_04"), new mp.Vector3(-675.5591430664062, 845.64013671875, 225.0524444580078), 249.83917236328125, dim, 'WORLD_HUMAN_SMOKING');
            npc.create(mp.game.joaat("a_m_y_bevhills_02"), new mp.Vector3(-664.0139770507812, 850.443115234375, 225.05242919921875), 94.47059631347656, dim, 'WORLD_HUMAN_DRINKING');
            npc.create(mp.game.joaat("a_f_y_bevhills_02"), new mp.Vector3(-664.9398193359375, 850.3634643554688, 225.05242919921875), 277.8046875, dim, 'WORLD_HUMAN_SMOKING');

        }
    },
    business: {
        pos: new mp.Vector3(-146.7850799560547, -641.9027099609375, 169.54539489746094),
        rot: new mp.Vector3(-5.124889373779297, 0, -175.16029357910156),
        vehList: [],
        loadNpc: () => {
            let dim = mp.players.local.remoteId + 1;
            npc.create(mp.game.joaat("ig_bankman"), new mp.Vector3(-146.45321655273438, -646.0671997070312, 168.82284545898438), 7.713514804840088, dim, '', 'anim@amb@board_room@diagram_blueprints@', 'idle_01_amy_skater_01', 9, 0);
            npc.create(mp.game.joaat("ig_barry"), new mp.Vector3(-147.931884765625, -644.6817626953125, 168.82286071777344), 286.4692077636719, dim, '', 'rcmme_amanda1', 'stand_loop_cop', 9, 0);
            npc.create(mp.game.joaat("a_m_y_business_03"), new mp.Vector3(-148.0652313232422, -643.1932983398438, 168.82286071777344), 272.37896728515625, dim, 'WORLD_HUMAN_AA_COFFEE');
            npc.create(mp.game.joaat("a_m_y_business_02"), new mp.Vector3(-145.43040466308594, -644.420654296875, 168.82286071777344), 95.15303039550781, dim, 'WORLD_HUMAN_CLIPBOARD');
            npc.create(mp.game.joaat("a_m_y_busicas_01"), new mp.Vector3(-145.47128295898438, -642.9779052734375, 168.82286071777344), 98.68002319335938, dim, 'CODE_HUMAN_MEDIC_TIME_OF_DEATH');
        }
    },
    empty: {
        pos: new mp.Vector3(5068.18798828125, -5780.14453125, 17.01439094543457),
        rot: new mp.Vector3(0.29037585854530334, 6.67019151023851e-9, 70.26126098632812),
        vehList: [],
        loadNpc: () => {
            let dim = mp.players.local.remoteId + 1;
        }
    }
};

let sceneList = [
    scenes.islandClub,
    scenes.islandVilla,
    scenes.islandTurist,
    scenes.losSantosPolice,
    scenes.fishing,
    scenes.mirrorPark,
    scenes.turistWater,
    scenes.bitchTrash,
    scenes.vinewoodParty,
    scenes.business,
];

cutscene.loadAuthRandom = function() {

    let scene = sceneList[methods.getRandomInt(0, sceneList.length)];

    scene.loadNpc();

    user.setVirtualWorld(mp.players.local.remoteId + 1);
    mp.players.local.position = new mp.Vector3(scene.pos.x, scene.pos.y, scene.pos.z + 10);
    mp.players.local.freezePosition(true);
    mp.players.local.setVisible(true, false);
    mp.players.local.setCollision(false, false);

    mp.game.ui.displayRadar(false);
    mp.gui.chat.activate(false);

    let cam = mp.cameras.new('customization');
    cam.shake("HAND_SHAKE", 0.3);
    cam.setCoord(scene.pos.x, scene.pos.y, scene.pos.z);
    cam.setRot(scene.rot.x, scene.rot.y, scene.rot.z, 2);
    mp.game.cam.renderScriptCams(true, false, 0, false, false);

    user.setCam(cam);

    scene.vehList.forEach(item => {
        let vCurrent = mp.vehicles.new(mp.game.joaat(item[0]), new mp.Vector3(item[1], item[2], item[3]), { heading: item[4], engine: false, locked: true, numberPlate: "OMG", dimension: mp.players.local.remoteId + 1 });
        vCurrent.setRotation(0, 0, item[4], 0, true);

        if (item[5]) {
            vCurrent.setSirenSound(true);
            vCurrent.setSiren(true);
        }

        vCurrent.setCanBeDamaged(false);
        vCurrent.setInvincible(true);
        if (item[6])
            vCurrent.setColours(item[6], item[6]);
        setTimeout(function () {try {vCurrent.freezePosition(true);} catch (e) {}}, 5000);
        vehiclesPool.push(vCurrent);
    });
    setTimeout(function () {
        mp.players.local.position = new mp.Vector3(scene.pos.x, scene.pos.y, scene.pos.z + 10);
    }, 5000)
};

cutscene.destroyVehicles = function() {
    try {
        vehiclesPool.forEach(v => {
            try {
                v.destroy();
            }
            catch (e) {}
        })
    }
    catch (e) {

    }
};

export default cutscene;