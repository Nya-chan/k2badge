<html>
	<head>
		<title>Kancolle Completion Badge Generator</title>
		<meta charset="UTF-8">
		<link href='http://fonts.googleapis.com/css?family=Exo' rel='stylesheet' type='text/css'>
		<link href='http://fonts.googleapis.com/css?family=Ubuntu' rel='stylesheet' type='text/css'>
		<script type="text/javascript" src="./jquery.min.js"></script>
		<script type="text/javascript" src="./litetabs.jquery.js"></script>
		<script type="text/javascript" src="js/tooltipster/tooltipster.bundle.min.js"></script>
		<script>
			var importName = <?php echo isset($_POST["ttkName"]) ? "'" . $_POST["ttkName"] . "'" : "undefined" ?>;
			var importLvl = <?php echo isset($_POST["ttkLvl"]) ? $_POST["ttkLvl"] : "undefined" ?>;
			var importServer = <?php echo isset($_POST["ttkServer"]) ? $_POST["ttkServer"] : "undefined" ?>;
			var importShips = <?php echo isset($_POST["ships"]) ? "'" . $_POST["ships"] . "'" : "undefined" ?>;
			var importK2 = <?php echo isset($_POST["k2Flag"]) ? "'" . $_POST["k2Flag"] . "'" : "undefined" ?>;
			var importColle = <?php echo isset($_POST["colleFlag"]) ? "'" . $_POST["colleFlag"] . "'" : "undefined" ?>;
			var importFleets = <?php echo isset($_POST["fleet"]) ? "'" . $_POST["fleet"] . "'" : "undefined" ?>;
			var apiMode = importName || importLvl || importServer || importShips || importFleets;
		</script>
		<script type="text/javascript" src="./Base64.js"></script>
		<script type="text/javascript" src="./js/DataManager.js"></script>
		<script type="text/javascript" src="./kaini.min.js?version=23"></script>
		<script type="text/javascript">
			lang = "en";
		</script>
		<script type="text/javascript" src="./ga.js"></script>
		
		<link href="./kaini.css" rel="stylesheet" type="text/css"/>
		<link href="./css/tooltipster/tooltipster.bundle.min.css" rel="stylesheet" type="text/css"/>
	</head>
	<body>
		<div id="wrapper">
			<h1>KanColle Badge Generator</h1>
			<div id="language"><span class="button active">EN</span><a href="index-jp.php" class="button">日本語</a><a href="index-cn.php" class="button">简体中文</a><a href="index-tw.php" class="button">繁體中文</a></div>
			<p>
				This tool requires a modern browser (IE10+, Firefox, Chrome, or Safari) with Javascript enabled.  Please refresh your cache when there is a new update.  The Flagship of the first fleet will be featured on the badge.  Please leave any bug reports or feature requests <a target="_blank" href="https://github.com/Nya-chan/k2badge/issues">here</a>.
			</p>
			<div id="canvasDiv">
				<canvas width="850" height="320" id="result"></canvas>
				<div id="buttonToggles">
					<button type="button" id="displayBadge" class="active">Kai 2</button>
					<button type="button" id="displayPoster">Poster</button>
					<button type="button" id="displayRoom">Room</button>
				</div>
				<div id="buttons">
					<div>
						<span id="loadingDiv">Loading images: </span><span id="loadingProgress"></span>
						<button type="button" id="save">Save</button>
						<button type="button" id="load">Load</button>
						<button type="button" id="export">Export Badge as PNG</button>
					</div>
				</div>
			</div>
			<div id="tabs" class="rounded">
				<ul>
					<li><a href="#ttkTab">General</a></li>
					<li><a href="#flagTab">Fleets</a></li>
					<li><a href="#shipTab">Kai Ni + Blueprint</a></li>
					<li><a href="#colleTab">Poster Collection</a></li>
					<li><a href="#furnTab">Furniture</a></li>
					<li><a href="#customTab">Custom</a></li>
				</ul>
				<div id="ttkInfo" name="#ttkTab">
					<div>
						<label for="name">Admiral Name</label> <input type="text" name="name" id="name" maxlength="26" placeholder="Admiral Name">
						<label for="level" class="short">Lv.</label> <input type="number" name="level" id="level" min="1" max="120" placeholder="1 - 120">
						<label for="server" class="short">Server</label> <select name="server" id="server">
							<option value="" disabled selected>------</option>
							<option value="1">横須賀鎮守府 Yokosuka Naval District</option>
							<option value="2">呉鎮守府 Kure Naval District</option>
							<option value="3">佐世保鎮守府 Sasebo Naval District</option>
							<option value="4">舞鶴鎮守府 Maizuru Naval District</option>
							<option value="5">大湊警備府 Ominato Guard District</option>
							<option value="6">トラック泊地 Truk Anchorage</option>
							<option value="7">リンガ泊地 Lingga Anchorage</option>
							<option value="8">ラバウル基地 Rabaul Naval Base</option>
							<option value="9">ショートランド泊地 Shortland Anchorage</option>
							<option value="10">ブイン基地 Buin Naval Base</option>
							<option value="11">タウイタウイ泊地 Tawi-Tawi Anchorage</option>
							<option value="12">パラオ泊地 Palau Anchorage</option>
							<option value="13">ブルネイ泊地 Brunei Anchorage</option>
							<option value="14">単冠湾泊地 Hitokappu Bay Anchorage</option>
							<option value="15">幌筵泊地 Paramushir Anchorage</option>
							<option value="16">宿毛泊地 Sukumo Anchorage</option>
							<option value="17">鹿屋基地 Kanoya Airfield</option>
							<option value="18">岩川基地 Iwagawa Airfield</option>
							<option value="19">佐伯湾泊地 Saiki Bay Anchorage</option>
							<option value="20">柱島泊地 Hashirajima Anchorage</option>
						</select>
					</div>
					<div><label for="avatarImg">Avatar Image</label> <input type='file' id="avatarImg" /> <button type="button" id="avatarClear">Clear</button></div>
					<div>
						<label for="useBG">Use Furniture</label> <input type="checkbox" name="useBG" id="useBG" checked><br />
						<label for="k2">Use Fleets</label> <input type="checkbox" name="k2" id="k2"><br />
						<label for="useBlue">Show Only Kai Ni (no BP Kai)</label> <input type="checkbox" name="useBlue" id="useBlue" checked>
					</div>
				</div>
				<div id="flagTab" name="#flagTab">			
					<div id="fleetWrapper">
						<div id="fleetSelect">
							<div id="fleet1" class="chosen">1</div>
							<div id="fleet2">2</div>
							<div id="fleet3">3</div>
							<div id="fleet4">4</div>
						</div>
						<div id="fleets">
							<div id="slot1" class="chosen"></div>
							<div id="slot2"></div>
							<div id="slot3"></div>
							<div id="slot4"></div>
							<div id="slot5"></div>
							<div id="slot6"></div>
							<button id="removeSlot" type="button">Remove</button>
						</div>
						<div id="fleetLevels">
							<div>Lv. <input id="level1" type="number" value="1"/></div>
							<div>Lv. <input id="level2" type="number" value="1"/></div>
							<div>Lv. <input id="level3" type="number" value="1"/></div>
							<div>Lv. <input id="level4" type="number" value="1"/></div>
							<div>Lv. <input id="level5" type="number" value="1"/></div>
							<div>Lv. <input id="level6" type="number" value="1"/></div>
						</div>
					</div>
					<div id="avatars" class="shipList">
						<label>DE 海防</label>
						<div class="divDE shipClasses"></div>
						<label>DD 駆逐</label>
						<div class="divDD shipClasses"></div>
						<label>CL/CLT 軽巡/雷巡</label>
						<div class="divCL shipClasses"></div>
						<label>CA/CAV 重巡/航巡</label>
						<div class="divCA shipClasses"></div>
						<label>BB/BBV 戦艦/航戦 </label>
						<div class="divBB shipClasses"></div>
						<label>CVL 軽母</label>
						<div class="divCVL shipClasses"></div>
						<label>CV/CVB 航/装母</label>
						<div class="divCV shipClasses"></div>
						<label>SS/SSV 潜/潜母</label>
						<div class="divSS shipClasses"></div>
						<label>AX その他</label>
						<div class="divAX shipClasses"></div>
						<button type="button" id="loadAbyss">Load Abyssal Ships 深海艦</button>
						<label class="hidden">ADD 深海駆逐</label>
						<div class="divADD shipClasses"></div>
						<label class="hidden">ACL/ACLT 深海軽巡/深海雷巡</label>
						<div class="divACL shipClasses"></div>
						<label class="hidden">ACA/ACAV 深海重巡/深海航巡</label>
						<div class="divACA shipClasses"></div>
						<label class="hidden">ABB/ABBV 深海戦艦/深海航戦 </label>
						<div class="divABB shipClasses"></div>
						<label class="hidden">ACVL/ACV 深海軽母/深海航</label>
						<div class="divACV shipClasses"></div>
						<label class="hidden">ASS/ASSV 深海潜/深海潜母</label>
						<div class="divASS shipClasses"></div>
						<label class="hidden">AINS 深海陸上</label>
						<div class="divAINS shipClasses"></div>
						<label class="hidden">AAX その他</label>
						<div class="divAAX shipClasses"></div>
					</div>
				</div>
				<div id="shipTab" name="#shipTab">
					<div class="shipClass" id="dd">
						<h3>Destroyers</h3>
						<div class="shipOptions"></div>
					</div>
					<div class="shipClass" id="cl">
						<h3>Light Cruisers</h3>
						<div class="shipOptions"></div>
					</div>
					<div class="shipClass" id="ca">
						<h3>Heavy Cruisers</h3>
						<div class="shipOptions"></div>
					</div>
					<div class="shipClass" id="bb">
						<h3>Battleships</h3>
						<div class="shipOptions"></div>
					</div>
					<div class="shipClass" id="cvl">
						<h3>Light Carriers</h3>
						<div class="shipOptions"></div>
					</div>
					<div class="shipClass" id="cv">
						<h3>Standard Carriers</h3>
						<div class="shipOptions"></div>
					</div>
					<div class="shipClass" id="ss">
						<h3>Submarines</h3>
						<div class="shipOptions"></div>
					</div>
					<div class="shipClass" id="ax">
						<h3>Auxiliary</h3>
						<div class="shipOptions"></div>
					</div>
					<div style="clear:both">
						<input type="checkbox" id="selectAll"><label for="selectAll">Select All</label>
					</div>
				</div>
			<div id="colleDiv" name="#colleTab">
				<div class="shipList">
					<label>DE 海防</label>
					<div class="divDE shipClasses"></div>
					<label>DD 駆逐</label>
					<div class="divDD shipClasses"></div>
					<label>CL/CLT 軽巡/雷巡</label>
					<div class="divCL shipClasses"></div>
					<label>CA/CAV 重巡/航巡</label>
					<div class="divCA shipClasses"></div>
					<label>BB/BBV 戦艦/航戦 </label>
					<div class="divBB shipClasses"></div>
					<label>CVL 軽母</label>
					<div class="divCVL shipClasses"></div>
					<label>CV/CVB 航/装母</label>
					<div class="divCV shipClasses"></div>
					<label>SS/SSV 潜/潜母</label>
					<div class="divSS shipClasses"></div>
					<label>AX その他</label>
					<div class="divAX shipClasses"></div>
				</div>
			</div>
			<div id="furndiv" name="#furnTab">
				<div class="furnitureClass invert" id="Floor">
					<h3>Floors</h3>
					<div class="shipOptions">
						<div><input type="radio" name="floor" value="001" id="f1" checked><label for="f1">Guardian Office Floor<br/>鎮守府の床</label></div>
						<div><input type="radio" name="floor" value="002" id="f2"><label for="f2">Natural Floor<br/>ナチュラルな床</label></div>
						<div><input type="radio" name="floor" value="003" id="f3"><label for="f3">Fluttering Spring Sakura Flooring<br/>桜舞う春のフローリング</label></div>
						<div><input type="radio" name="floor" value="004" id="f4"><label for="f4">New Greenery Flooring<br/>新緑のフローリング</label></div>
						<div><input type="radio" name="floor" value="005" id="f5"><label for="f5">High Class Flooring<br/>高級フローリング</label></div>
						<div><input type="radio" name="floor" value="006_1" id="f6_1"><label for="f6_1">Sandy Floor 1<br/>砂浜の床1</label></div>
						<div><input type="radio" name="floor" value="006_2" id="f6_2"><label for="f6_2">Sandy Floor 2<br/>砂浜の床2</label></div>
						<div><input type="radio" name="floor" value="007" id="f7"><label for="f7">Blue Carpet<br/>ブルーカーペット</label></div>
						<div><input type="radio" name="floor" value="009" id="f9"><label for="f9">White Slate Tile<br/>白い石版タイル</label></div>
						<div><input type="radio" name="floor" value="012" id="f12"><label for="f12">Small Floral Carpet<br/>小花柄カーペット</label></div>
						<div><input type="radio" name="floor" value="014" id="f14"><label for="f14">Cherry Flooring<br/>桜の床</label></div>
						<div><input type="radio" name="floor" value="017" id="f17"><label for="f17">Pink Floor<br/>ピンクの床</label></div>
						<div><input type="radio" name="floor" value="020" id="f20"><label for="f20">European Carpet<br/>西欧風カーペット</label></div>
						<div><input type="radio" name="floor" value="021" id="f21"><label for="f21">Luxury Crimson Carpet<br/>真っ赤な高級絨毯</label></div>
						<div><input type="radio" name="floor" value="022" id="f22"><label for="f22">Pure White Fluffy Carpet<br/>真っ白なフワフワ絨毯</label></div>
						<div><input type="radio" name="floor" value="023_1" id="f23_1"><label for="f23_1">Snowy Field Floor 1<br/>雪原の床1</label></div>
						<div><input type="radio" name="floor" value="023_2" id="f23_2"><label for="f23_2">Snowy Field Floor 2<br/>雪原の床2</label></div>
						<div><input type="radio" name="floor" value="023_2" id="f23_3"><label for="f23_3">Snowy Field Floor 3<br/>雪原の床3</label></div>
						<div><input type="radio" name="floor" value="024" id="f24"><label for="f24">Spring-colored Flooring<br/>春色の床</label></div>
						<div><input type="radio" name="floor" value="025" id="f25"><label for="f25">New Tatami<br/>青畳</label></div>
						<div><input type="radio" name="floor" value="026" id="f26"><label for="f26">Luxury White Marble Flooring<br/>白い高級大理石床</label></div>
						<div><input type="radio" name="floor" value="031" id="f31"><label for="f31">Flight Deck<br/>飛行甲板</label></div>
						<div><input type="radio" name="floor" value="033" id="f33"><label for="f33">Concrete Floor<br/>コンクリート床</label></div>
						<div><input type="radio" name="floor" value="034" id="f34"><label for="f34">Doodle Floor<br/>ラクガキ床</label></div>
						<div><input type="radio" name="floor" value="035" id="f35"><label for="f35">Battleship Tile Floor<br/>戦艦タイルの床</label></div>
						<div><input type="radio" name="floor" value="037" id="f37"><label for="f37">Igusa Tatami Mat<br/>い草の畳</label></div>
						<div><input type="radio" name="floor" value="038" id="f38"><label for="f38">Beach Teahouse Floor<br/>浜茶屋の床</label></div>
						<div><input type="radio" name="floor" value="039" id="f39"><label for="f39">Uzuki's Floor<br/>卯月の床</label></div>
					</div>
				</div>
				<div class="furnitureClass invert" id="Wall">
					<h3>Walls</h3>
					<div class="shipOptions">
						<div><input type="radio" name="wall" value="001" id="w1" checked><label for="w1">Normal Wallpaper<br/>普通の壁紙</label></div>
						<div><input type="radio" name="wall" value="002" id="w2" ><label for="w2">Low Budget Wallpaper<br/>低予算な壁紙</label></div>
						<div><input type="radio" name="wall" value="003" id="w3" ><label for="w3">Simple Japanese Wallpaper<br/>和のシンプル壁紙</div>
						<div><input type="radio" name="wall" value="004" id="w4" ><label for="w4">Green Wallpaper<br/>緑の壁紙</label></label></div>
						<div><input type="radio" name="wall" value="005" id="w5"><label for="w5">Spring Design Wallpaper<br/>春仕様の壁紙</label></div>
						<div><input type="radio" name="wall" value="007" id="w7"><label for="w7">Chocolate Wallpaper<br/>チョコレートの壁紙</label></div>
						<div><input type="radio" name="wall" value="008" id="w8"><label for="w8">Pop Wallpaper<br/>ポップな壁紙</label></div>
						<div><input type="radio" name="wall" value="009" id="w9"><label for="w9">Candy-making Wallpaper<br/>お菓子作りの壁紙</label></div>
						<div><input type="radio" name="wall" value="010" id="w10"><label for="w10">High Class Japanese-style Wallpaper<br/>高級和風壁紙</label></div>
						<div><input type="radio" name="wall" value="011" id="w11"><label for="w11">Furniture Craftsman's Wallpaper<br/>家具職人の壁紙</label></div>
						<div><input type="radio" name="wall" value="012" id="w12"><label for="w12">Autumn Design Wallpaper<br/>秋仕様の壁紙</label></div>
						<div><input type="radio" name="wall" value="013" id="w13"><label for="w13">Simple Modern Wallpaper<br/>シンプルモダン壁紙</label></div>
						<div><input type="radio" name="wall" value="014" id="w14"><label for="w14">Battleship-colored Wall<br/>軍艦色の壁</label></div>
						<div><input type="radio" name="wall" value="015" id="w15"><label for="w15">White Winter Wallpaper<br/>白い冬の壁紙</label></div>
						<div><input type="radio" name="wall" value="016" id="w16"><label for="w16">Blue Wallpaper<br/>青い壁紙</label></div>
						<div><input type="radio" name="wall" value="017" id="w17"><label for="w17">High Quality Red Brick Wall<br/>高級赤煉瓦の壁</label></div>
						<div><input type="radio" name="wall" value="018" id="w18"><label for="w18">Check & Leaf Wallpaper<br/>チェック＆リーフ壁紙</label></div>
						<div><input type="radio" name="wall" value="019" id="w19"><label for="w19">Wooden Board Wall<br/>木板の壁</label></div>
						<div><input type="radio" name="wall" value="020" id="w20"><label for="w20">High Quality Wood Wall<br/>高級木材の壁</label></div>
						<div><input type="radio" name="wall" value="021" id="w21"><label for="w21">Paper Crane Wallpaper<br/>折鶴の壁紙</label></div>
						<div><input type="radio" name="wall" value="022" id="w22"><label for="w22">Green Japanese Wallpaper<br/>緑の和壁紙</label></div>
						<div><input type="radio" name="wall" value="023" id="w23"><label for="w23">New Greenery Wallpaper<br/>新緑の壁紙</label></div>
						<div><input type="radio" name="wall" value="024" id="w24"><label for="w24">Pink Dot Wallpaper<br/>ピンクドット壁紙</label></div>
						<div><input type="radio" name="wall" value="026" id="w26"><label for="w26">Winter Modern Art Wallpaper<br/>冬のモダンアート壁紙</label></div>
						<div><input type="radio" name="wall" value="027" id="w27"><label for="w27">Japanese Modern Art Wallpaper<br/>和モダンアート壁紙</label></div>
						<div><input type="radio" name="wall" value="028" id="w28"><label for="w28">Hinamatsuri Wallpaper<br/>桃の節句の壁紙</label></div>
						<div><input type="radio" name="wall" value="030" id="w30"><label for="w30">New Years Wallpaper<br/>新春の壁紙</label></div>
						<div><input type="radio" name="wall" value="031" id="w31"><label for="w31">Concrete Wall<br/>コンクリート壁</label></div>
						<div><input type="radio" name="wall" value="032" id="w32"><label for="w32">Pink Concrete Wall<br/>ピンクコンクリ壁</label></div>
						<div><input type="radio" name="wall" value="033" id="w33"><label for="w33">Dragon Wallpaper<br/>龍の壁紙</label></div>
						<div><input type="radio" name="wall" value="034" id="w34"><label for="w34">Autumn Leaves Wallpaper<br/>紅葉の壁紙</label></div>
						<div><input type="radio" name="wall" value="035" id="w35"><label for="w35">Spring Color Wallpaper<br/>春色の壁紙</label></div>
						<div><input type="radio" name="wall" value="036" id="w36"><label for="w36">Bar Wall Design<br/>バー仕様の壁</label></div>
						<div><input type="radio" name="wall" value="037" id="w37"><label for="w37">Plum-Purple Wallpaper<br/>梅紫の壁紙</label></div>
						<div><input type="radio" name="wall" value="038" id="w38"><label for="w38">Rainy Season Wallpaper<br/>梅雨の壁紙</label></div>
						<div><input type="radio" name="wall" value="039" id="w39"><label for="w39">Beach Teahouse Temporary Wallboard<br/>浜茶屋の仮設壁</label></div>
						<div><input type="radio" name="wall" value="040" id="w40"><label for="w40">Uzuki's Wallpaper<br/>卯月の壁紙</label></div>

					</div>
				</div>
				<div class="furnitureClass invert" id="Desk">
					<h3>Desks</h3>
					<div class="shipOptions">
						<div><input type="radio" name="desk" value="000" id="d0" checked><label for="d0">None</label></div>
						<div><input type="radio" name="desk" value="001" id="d1"><label for="d1">Just Some Cardboard<br/>ただの段ボール</label></div>
						<div><input type="radio" name="desk" value="002" id="d2"><label for="d2">Chair<br/>椅子</label></div>
						<div><input type="radio" name="desk" value="003" id="d3"><label for="d3">Office Desk<br/>執務机</label></div>
						<div><input type="radio" name="desk" value="005" id="d5"><label for="d5">Admiral's Desk<br/>提督の机</label></div>
						<div><input type="radio" name="desk" value="007" id="d7"><label for="d7">General's Desk<br/>大将の机</label></div>
						<div><input type="radio" name="desk" value="009" id="d9"><label for="d9">Interior Chair<br/>インテリア椅子</label></div>
						<div><input type="radio" name="desk" value="011" id="d11"><label for="d11">Classroom Set "Teacher's Desk"<br/>教室セット「教卓」</label></div>
						<div><input type="radio" name="desk" value="012" id="d12"><label for="d12">Modern Chair<br/>モダンチェア</label></div>
						<div><input type="radio" name="desk" value="013" id="d13"><label for="d13">Destroyer Kanmusu's Tree<br/>駆逐艦娘のツリー</label></div>
						<div><input type="radio" name="desk" value="015" id="d15"><label for="d15">Sanma Dinner Table<br/>秋刀魚の食卓</label></div>
						<div><input type="radio" name="desk" value="016" id="d16"><label for="d16">Adult Setsubun Set<br/>大人の節分セット</label></div>
						<div><input type="radio" name="desk" value="017" id="d17"><label for="d17">Photography Set<br/>撮影セット</label></div>
						<div><input type="radio" name="desk" value="018" id="d18"><label for="d18">A Kotatsu Taken Out Too Early<br/>早く出しすぎた炬燵</label></div>
						<div><input type="radio" name="desk" value="019" id="d19"><label for="d19">Down Futon and Pillows<br/>羽毛布団と枕</label></div>
						<div><input type="radio" name="desk" value="020" id="d20"><label for="d20">Worn-out Futon<br/>煎餅布団</label></div>
						<div><input type="radio" name="desk" value="021" id="d21"><label for="d21">Alcove<br/>床の間</label></div>
						<div><input type="radio" name="desk" value="022" id="d22"><label for="d22">Kanmusu Only Desk<br/>艦娘専用デスク</label></div>
						<div><input type="radio" name="desk" value="023" id="d23"><label for="d23">Admiral's Mahjong Table<br/>提督の麻雀卓</label></div>
						<div><input type="radio" name="desk" value="024" id="d24"><label for="d24">Watermelon Splitting Set<br/>西瓜割りセット</label></div>
						<div><input type="radio" name="desk" value="025" id="d25"><label for="d25">High Class Sewing Machine<br/>高級ミシン</label></div>
						<div><input type="radio" name="desk" value="026" id="d26"><label for="d26">Kongou's Tea Set<br/>金剛の紅茶セット</label></div>
						<div><input type="radio" name="desk" value="029" id="d29"><label for="d29">Kiddie Pool<br/>ご家庭用プール</label></div>
						<div><input type="radio" name="desk" value="030" id="d30"><label for="d30">Glass Table<br/>ガラステーブル</label></div>
						<div><input type="radio" name="desk" value="032" id="d32"><label for="d32">Single Bed<br/>シングルベッド</label></div>
						<div><input type="radio" name="desk" value="033" id="d33"><label for="d33">Chocolate Bar Desk<br/>板チョコ型の机</label></div>
						<div><input type="radio" name="desk" value="034" id="d34"><label for="d34">Futon and Pillows<br/>布団と枕</label></div>
						<div><input type="radio" name="desk" value="035" id="d35"><label for="d35">Wooden Office Desk<br/>ウッディな執務机</label></div>
						<div><input type="radio" name="desk" value="036" id="d36"><label for="d36">Cyprus Hot Spring<br/>温泉檜風呂</label></div>
						<div><input type="radio" name="desk" value="037" id="d37"><label for="d37">Turkey Feast<br/>七面鳥のご馳走</label></div>
						<div><input type="radio" name="desk" value="038" id="d38"><label for="d38">Four-Step Deluxe Hina Dolls<br/>雛人形豪華四段飾り</label></div>
						<div><input type="radio" name="desk" value="040" id="d40"><label for="d40">Admiral's Writing Desk<br/>提督の書斎机</label></div>
						<div><input type="radio" name="desk" value="041" id="d41"><label for="d41">Manuscript Desk<br/>原稿机</label></div>
						<div><input type="radio" name="desk" value="042a" id="d42a"><label for="d42a">Indoor Pool "Summer"<br/>ご家庭用プール「夏」</label></div>
						<div><input type="radio" name="desk" value="042b" id="d42b"><label for="d42b">Indoor Pool "Other"<br/>ご家庭用プール「他」</label></div>
						<div><input type="radio" name="desk" value="043" id="d43"><label for="d43">Sanma Dinner Table<br/>秋刀魚の食卓</label></div>
						<div><input type="radio" name="desk" value="045" id="d45"><label for="d45">Blue and White Tree<br/>白と青のツリー</label></div>
						<div><input type="radio" name="desk" value="046" id="d46"><label for="d46">Hatsumoude Set<br/>鎮守府初詣セット</label></div>
						<div><input type="radio" name="desk" value="047" id="d47"><label for="d47">New Year's Eve Soba<br/>年越し蕎麦</label></div>
						<div><input type="radio" name="desk" value="048" id="d48"><label for="d48">Chocolate Kitchen<br/>チョコレートキッチン</label></div>
						<div><input type="radio" name="desk" value="049" id="d49"><label for="d49">Spirit & Wine Shelf<br/>洋酒＆ワイン棚</label></div>
						<div><input type="radio" name="desk" value="050" id="d50"><label for="d50">Stone Hot Spring Bath<br/>温泉岩風呂</label></div>
						<div><input type="radio" name="desk" value="051" id="d51"><label for="d51">Hydragea Pot Admiral Desk<br/>紫陽花鉢の提督机</label></div>
						<div><input type="radio" name="desk" value="052" id="d52"><label for="d52">Cold Bath<br/>水風呂</label></div>
						<div><input type="radio" name="desk" value="052a" id="d52a"><label for="d52a">Cold Bath (Sub)<br/>水風呂「水」</label></div>
						<div><input type="radio" name="desk" value="052b" id="d52b"><label for="d52b">Cold Bath (Fairy)<br/>水風呂「妖」</label></div>
						<div><input type="radio" name="desk" value="053" id="d53"><label for="d53">Guardian Office Beach Teahouse<br/>鎮守府浜茶屋</label></div>
						<div><input type="radio" name="desk" value="054" id="d54"><label for="d54">Guardian Office Autumn Festival Stall<br/>鎮守府秋祭りの屋台</label></div>
						<div><input type="radio" name="desk" value="055a" id="d55a"><label for="d55a">Guardian Office Autumn Festival Shooting Gallery "Down"<br/>鎮守府秋祭りの射的「下」</label></div>
						<div><input type="radio" name="desk" value="055b" id="d55b"><label for="d55b">Guardian Office Autumn Festival Shooting Gallery "Up"<br/>鎮守府秋祭りの射的「上」</label></div>
						<div><input type="radio" name="desk" value="056" id="d56"><label for="d56">Guardian Office Autumn Sanma Festival<br/>鎮守府秋刀魚祭り</label></div>
						<div><input type="radio" name="desk" value="057" id="d57"><label for="d57">Turkey Dinner<br/>七面鳥のディナー</label></div>
						<div><input type="radio" name="desk" value="058" id="d58"><label for="d58">Admiral's New Years Big Treat<br/>年末年始の提督大奮発</label></div>
						<div><input type="radio" name="desk" value="059" id="d59"><label for="d59">Mutsuki's Desk<br/>睦月の机</label></div>
						<div><input type="radio" name="desk" value="060" id="d60"><label for="d60">Admiral's Cookie Kitchen<br/>提督のクッキーキッチン</label></div>
						<div><input type="radio" name="desk" value="061a" id="d61a"><label for="d61a">Admiral's Dining Table (Breakfast)<br/>提督の作る食卓「朝ごはん」</label></div>
						<div><input type="radio" name="desk" value="061b" id="d61b"><label for="d61b">Admiral's Dining Table (Curry)<br/>提督の作る食卓「カレー」</label></div>
						<div><input type="radio" name="desk" value="061c" id="d61c"><label for="d61c">Admiral's Dining Table (Fricandeau)<br/>提督の作る食卓「フーカデン」</label></div>
						<div><input type="radio" name="desk" value="062" id="d62"><label for="d62">Uzuki's Desk<br/>卯月の机</label></div>
					</div>
				</div>
				<div class="furnitureClass invert" id="Object">
					<h3>Wall Decoration</h3>
					<div class="shipOptions">
						<div><input type="radio" name="object" value="000" id="o0" checked><label for="o0">None</label></div>
						<div><input type="radio" name="object" value="002" id="o2"><label for="o2">Old Hanging Wall Clock<br/>壁掛け古時計</label></div>
						<div><input type="radio" name="object" value="003" id="o3"><label for="o3">Apology Hanging Scroll<br/>お詫び掛け軸</label></div>
						<div><input type="radio" name="object" value="004" id="o4"><label for="o4">Stained Glass<br/>ステンドグラス</label></div>
						<div><input type="radio" name="object" value="005" id="o5"><label for="o5">Deer Object<br/>鹿のオブジェ</label></div>
						<div><input type="radio" name="object" value="006" id="o6"><label for="o6">"Ocean Escort" Hanging Scroll<br/>「海上護衛」掛け軸</label></div>
						<div><input type="radio" name="object" value="007" id="o7"><label for="o7">Flower Painting<br/>花の絵画</label></div>
						<div><input type="radio" name="object" value="008" id="o8"><label for="o8">"Thanks for 200,000" Hanging Scroll<br/>「20万の感謝」掛け軸</label></div>
						<div><input type="radio" name="object" value="009" id="o9"><label for="o9">"Thanks for 1,000,000" Hanging Scroll<br/>「100万の感謝」掛け軸</label></div>
						<div><input type="radio" name="object" value="010" id="o10"><label for="o10">???<br/>???</label></div>
						<div><input type="radio" name="object" value="011" id="o11"><label for="o11">"Night Battle" Scroll<br/>「夜戦」掛け軸</label></div>
						<div><input type="radio" name="object" value="012" id="o12"><label for="o12">"Thanks for 500,000" Hanging Scroll<br/>「50万の感謝」掛け軸</label></div>
						<div><input type="radio" name="object" value="013" id="o13"><label for="o13">"Happy New Year" Hanging Scroll<br/>「謹賀新年」掛け軸</label></div>
						<div><input type="radio" name="object" value="014" id="o14"><label for="o14">"Thanks for 800,000" Hanging Scroll<br/>「80万の感謝」掛け軸</label></div>
						<div><input type="radio" name="object" value="015" id="o15"><label for="o15">Old World Map<br/>古い世界地図</label></div>
						<div><input type="radio" name="object" value="016" id="o16"><label for="o16">"Nanodesu" Hanging Scroll<br/>「なのです」掛け軸</label></div>
						<div><input type="radio" name="object" value="017" id="o17"><label for="o17">"Destroyer Division 6" Hanging Scroll<br/>「第六駆逐隊」掛け軸</label></div>
						<div><input type="radio" name="object" value="019" id="o19"><label for="o19">Small Houseplant<br/>小さな観葉植物</label></div>
						<div><input type="radio" name="object" value="021" id="o21"><label for="o21">"Maizuru Naval District" Hanging Scroll<br/>「舞鶴鎮守府」掛け軸</label></div>
						<div><input type="radio" name="object" value="022" id="o22"><label for="o22">Arrangement<br/>アレンジメント</label></div>
						<div><input type="radio" name="object" value="023" id="o23"><label for="o23">Mounted Map Exercise Set<br/>壁掛け図上演習セット</label></div>
						<div><input type="radio" name="object" value="024" id="o24"><label for="o24">"Thanks for 1,500,000" Hanging Scroll<br/>「150万の感謝」掛け軸</label></div>
						<div><input type="radio" name="object" value="025" id="o25"><label for="o25">"Thanks for 1,800,000" Hanging Scroll<br/>「180万の感謝」掛け軸</label></div>
						<div><input type="radio" name="object" value="026" id="o26"><label for="o26">"First Anniversary" Hanging Scroll<br/>「一周年記念」掛け軸</label></div>
						<div><input type="radio" name="object" value="027" id="o27"><label for="o27">Monster Movie Poaster<br/>怪獣映画ポスター</label></div>
						<div><input type="radio" name="object" value="028" id="o28"><label for="o28">Mt. Fuji Mural<br/>富士山の壁画</label></div>
						<div><input type="radio" name="object" value="029" id="o29"><label for="o29">Battleship Movie Poster<br/>戦艦映画ポスター</label></div>
						<div><input type="radio" name="object" value="031" id="o31"><label for="o31">Experimental Naval Warfare Poster<br/>試作艦戦ポスター</label></div>
						<div><input type="radio" name="object" value="032" id="o32"><label for="o32">Classroom Set "Blackboard"<br/>教室セット「黒板」</label></div>
						<div><input type="radio" name="object" value="033" id="o33"><label for="o33">"Thanks for 2,000,000" Hanging Scroll<br/>「200万の感謝」掛け軸</label></div>
						<div><input type="radio" name="object" value="034" id="o34"><label for="o34">"Camoflauge Doctrine" Hanging Scroll<br/>「迷彩主義」掛け軸</label></div>
						<div><input type="radio" name="object" value="035" id="o35"><label for="o35">Grandfather Clock<br/>大きな古時計</label></div>
						<div><input type="radio" name="object" value="036" id="o36"><label for="o36">"Yokosuka Naval District" Hanging Scroll<br/>「横須賀鎮守府」掛け軸</label></div>
						<div><input type="radio" name="object" value="037" id="o37"><label for="o37">"Thank You" Hanging Scroll<br/>「ありがとう」掛け軸</label></div>
						<div><input type="radio" name="object" value="038" id="o38"><label for="o38">Winter Decorations<br/>冬の飾り付け</label></div>
						<div><input type="radio" name="object" value="039" id="o39"><label for="o39">New Years 2015 Scroll<br/>新春掛け軸二〇一五</label></div>
						<div><input type="radio" name="object" value="040" id="o40"><label for="o40">Shimenawa Decorations<br/>しめ飾り</label></div>
						<div><input type="radio" name="object" value="041" id="o41"><label for="o41">"Thanks for 2,500,000" Hanging Scroll<br/>「250万の感謝」掛け軸</label></div>
						<div><input type="radio" name="object" value="042a" id="o42a"><label for="o42a">Musashi's Hanging Scroll "I Have Returned"<br/>武蔵の掛け軸「私は此処だ」</label></div>
						<div><input type="radio" name="object" value="042b" id="o42b"><label for="o42b">Musashi's Hanging Scroll "Welcome Home"<br/>武蔵の掛け軸「おかえりなさい」</label></div>
						<div><input type="radio" name="object" value="043" id="o43"><label for="o43">Mt. Fuji Tile Picture<br/>富嶽タイル画</label></div>
						<div><input type="radio" name="object" value="044" id="o44"><label for="o44">"Second Anniversary" Hanging Scroll<br/>「二周年記念」掛け軸</label></div>
						<div><input type="radio" name="object" value="045a" id="o45a"><label for="o45a">"Thanks for 3,500,000" Hanging Scroll "Up"<br/>「300万の感謝」掛け軸「上」</label></div>
						<div><input type="radio" name="object" value="045b" id="o45b"><label for="o45b">"Thanks for 3,500,000" Hanging Scroll "Down"<br/>「300万の感謝」掛け軸「下」</label></div>
						<div><input type="radio" name="object" value="046" id="o46"><label for="o46">Fleet Shaved Ice Banner<br/>艦隊氷旗</label></div>
						<div><input type="radio" name="object" value="047" id="o47"><label for="o47">"Naval Review" Hanging Scroll<br/>「観艦式」掛け軸</label></div>
						<div><input type="radio" name="object" value="048" id="o48"><label for="o48">"Rabaul Base" Hanging Scroll<br/>「ラバウル基地」掛け軸</label></div>
						<div><input type="radio" name="object" value="049" id="o49"><label for="o49">"Buin Base" Hanging Scroll<br/>「ブイン基地」掛け軸</label></div>
						<div><input type="radio" name="object" value="050" id="o50"><label for="o50">Fleet Big Fishing Flag<br/>艦隊大漁旗</label></div>
						<div><input type="radio" name="object" value="051" id="o51"><label for="o51">"Truk Anchorage" Hanging Scroll<br/>「トラック泊地」掛け軸</label></div>
						<div><input type="radio" name="object" value="052a" id="o52a"><label for="o52a">Night Apology Hanging Scroll (1)<br/>夜のお詫び掛け軸(壱)</label></div>
						<div><input type="radio" name="object" value="052b" id="o52b"><label for="o52b">Night Apology Hanging Scroll (1) "Searchlight"<br/>夜のお詫び掛け軸(壱)「探照灯」</label></div>
						<div><input type="radio" name="object" value="053" id="o53"><label for="o53">Night Apology Hanging Scroll (2)<br/>夜のお詫び掛け軸(弐)</label></div>
						<div><input type="radio" name="object" value="054" id="o54"><label for="o54">Fleet Safety Decoration<br/>艦隊安全お飾り</label></div>
						<div><input type="radio" name="object" value="055" id="o55"><label for="o55">"Kure Guardian Office" Hanging Scroll<br/>「呉鎮守府」掛け軸</label></div>
						<div><input type="radio" name="object" value="056" id="o56"><label for="o56">"Sasebo Guardian Office" Hanging Scroll<br/>「佐世保鎮守府」掛け軸</label></div>
						<div><input type="radio" name="object" value="057" id="o57"><label for="o57">Aircraft Carrier Stained Glass<br/>航空母艦ステンドグラス</label></div>
						<div><input type="radio" name="object" value="058" id="o58"><label for="o58">Aviation Battleship Stained Glass<br/>航空戦艦ステンドグラス</label></div>
						<div><input type="radio" name="object" value="059" id="o59"><label for="o59">"Spring is Number 1" Hanging Scroll<br/>「春の一番」掛け軸</label></div>
						<div><input type="radio" name="object" value="060" id="o60"><label for="o60">Spring Type B Sisters Panel<br/>春の乙型姉妹パネル</label></div>
						<div><input type="radio" name="object" value="061a" id="o61a"><label for="o61a">Uzuki's Hanging Scroll "Up"<br/>卯月の掛け軸「上」</label></div>
						<div><input type="radio" name="object" value="061b" id="o61b"><label for="o61b">Uzuki's Hanging Scroll "Down"<br/>卯月の掛け軸「下」</label></div>
						<div><input type="radio" name="object" value="062" id="o62"><label for="o62">"Third Anniversary" Hanging Scroll<br/>「三周年記念」掛け軸</label></div>
					</div>
				</div>
				<div class="furnitureClass invert" id="Chest">
					<h3>Chest</h3>
					<div class="shipOptions">
						<div><input type="radio" name="chest" value="000" id="c0" checked><label for="c0">None</label></div>
						<div><input type="radio" name="chest" value="003" id="c3"><label for="c3">Sideboard<br/>サイドボード</label></div>
						<div><input type="radio" name="chest" value="004" id="c4"><label for="c4">"Fog" Wardrobe<br/>「霧」の桐箪笥</label></div>
						<div><input type="radio" name="chest" value="005" id="c5"><label for="c5">Setsubun "Bean Scattering" Set<br/>節分「豆まき」セット</label></div>
						<div><input type="radio" name="chest" value="006" id="c6"><label for="c6">Fireplace<br/>暖炉</label></div>
						<div><input type="radio" name="chest" value="007" id="c7"><label for="c7">Chocolate Cake and Tea Set<br/>チョコケーキと紅茶セット</label></div>
						<div><input type="radio" name="chest" value="008" id="c8"><label for="c8">"Nagato" and "Mutsu" Hina Dolls<br/>「長門」「陸奥」の雛人形</label></div>
						<div><input type="radio" name="chest" value="009" id="c9"><label for="c9">Elegant Board<br/>エレガントボード</label></div>
						<div><input type="radio" name="chest" value="010" id="c10"><label for="c10">Guardian Office Tree<br/>鎮守府のツリー</label></div>
						<div><input type="radio" name="chest" value="011" id="c11"><label for="c11">Fairy Tale Shelf<br/>メルヘンシェルフ</label></div>
						<div><input type="radio" name="chest" value="012" id="c12"><label for="c12">Kettle Stove<br/>やかんストーブ</label></div>
						<div><input type="radio" name="chest" value="013" id="c13"><label for="c13">Classic Shelf<br/>クラシックシェルフ</label></div>
						<div><input type="radio" name="chest" value="014" id="c14"><label for="c14">Heavy Cruiser Model and Wardrobe<br/>重巡模型と桐箪笥</label></div>
						<div><input type="radio" name="chest" value="015" id="c15"><label for="c15">"Akagi" Model and Wardrobe<br/>「赤城」模型と桐箪笥</label></div>
						<div><input type="radio" name="chest" value="016" id="c16"><label for="c16">"Nagato" Model and Wardrobe<br/>「長門」模型と桐箪笥</label></div>
						<div><input type="radio" name="chest" value="017" id="c17"><label for="c17">Folding Desk<br/>折り畳み机</label></div>
						<div><input type="radio" name="chest" value="019" id="c19"><label for="c19">Hanger Rack<br/>ハンガーラック</label></div>
						<div><input type="radio" name="chest" value="020" id="c20"><label for="c20">Dresser<br/>ドレッサー</label></div>
						<div><input type="radio" name="chest" value="022" id="c22"><label for="c22">Z Flag Fireplace<br/>Z旗の暖炉</label></div>
						<div><input type="radio" name="chest" value="023" id="c23"><label for="c23">Green Planter<br/>緑のプランター</label></div>
						<div><input type="radio" name="chest" value="024" id="c24"><label for="c24">Spring Cleaning Set<br/>模様替えお掃除セット</label></div>
						<div><input type="radio" name="chest" value="025" id="c25"><label for="c25">Japanese Iris Wardrobe<br/>しょうぶ和箪笥</label></div>
						<div><input type="radio" name="chest" value="026" id="c26"><label for="c26">Operating Table Set<br/>診療台セット</label></div>
						<div><input type="radio" name="chest" value="027" id="c27"><label for="c27">Classroom Set "Desk"<br/>教室セット「机」</label></div>
						<div><input type="radio" name="chest" value="028" id="c28"><label for="c28">"Musashi" Model and Wardrobe<br/>「武蔵」模型と桐箪笥</label></div>
						<div><input type="radio" name="chest" value="029a" id="c29a"><label for="c29a">"Kaga" Model and Wardrobe "CV"<br/>「加賀」模型と桐箪笥「航空母」</label></div>
						<div><input type="radio" name="chest" value="029b" id="c29b"><label for="c29b">"Kaga" Model and Wardrobe "CV+Fairy"<br/>「加賀」模型と桐箪笥「航空母+妖精」</label></div>
						<div><input type="radio" name="chest" value="029c" id="c29c"><label for="c29c">"Kaga" Model and Wardrobe "DDH"<br/>「加賀」模型と桐箪笥「ヘリ空母」</label></div>
						<div><input type="radio" name="chest" value="029d" id="c29d"><label for="c29d">"Kaga" Model and Wardrobe "DDH+Fairy"<br/>「加賀」模型と桐箪笥「ヘリ空母+妖精」</label></div>
						<div><input type="radio" name="chest" value="030" id="c30"><label for="c30">Dharma<br/>だるま</label></div>
						<div><input type="radio" name="chest" value="032" id="c32"><label for="c32">Ready For Summer Set<br/>夏先取りセット</label></div>
						<div><input type="radio" name="chest" value="033" id="c33"><label for="c33">Resort Set<br/>リゾートセット</label></div>
						<div><input type="radio" name="chest" value="034" id="c34"><label for="c34">Office Bookshelf<br/>書斎本棚</label></div>
						<div><input type="radio" name="chest" value="036" id="c36"><label for="c36">Kadomatsu<br/>門松</label></div>
						<div><input type="radio" name="chest" value="037" id="c37"><label for="c37">Sake & Whiskey Shelf<br/>日本酒＆ウィスキー棚</label></div>
						<div><input type="radio" name="chest" value="038a" id="c38a"><label for="c38a">Dressing Room "Bathtowel"<br/>脱衣所「バスタオル」</label></div>
						<div><input type="radio" name="chest" value="038b" id="c38b"><label for="c38b">Dressing Room "Carrier"<br/>脱衣所「航」</label></div>
						<div><input type="radio" name="chest" value="038c" id="c38c"><label for="c38c">Dressing Room "Light Carrier"<br/>脱衣所「軽母」</label></div>
						<div><input type="radio" name="chest" value="038d" id="c38d"><label for="c38d">Dressing Room "Battleship"<br/>脱衣所「戦」</label></div>
						<div><input type="radio" name="chest" value="038e" id="c38e"><label for="c38e">Dressing Room "Destroyer"<br/>脱衣所「駆逐」</label></div>
						<div><input type="radio" name="chest" value="038f" id="c38f"><label for="c38f">Dressing Room "Submarine"<br/>脱衣所「潜」</label></div>
						<div><input type="radio" name="chest" value="038g" id="c38g"><label for="c38g">Dressing Room<br/>脱衣所</label></div>
						<div><input type="radio" name="chest" value="039" id="c39"><label for="c39">Raincoat and Umbrella Hangar<br/>レインコート＆傘掛け</label></div>
						<div><input type="radio" name="chest" value="040" id="c40"><label for="c40">Industrial Shaved Ice Machine<br/>業務用かき氷機</label></div>
						<div><input type="radio" name="chest" value="041" id="c41"><label for="c41">Northern Camoflauge Wardrobe<br/>北方迷彩な桐箪笥</label></div>
						<div><input type="radio" name="chest" value="042" id="c42"><label for="c42">Guardian Office Tea Party Set<br/>鎮守府お茶会セット</label></div>
					</div>
				</div>
				<div class="furnitureClass invert" id="Window">
					<h3>Windows</h3>
					<div class="shipOptions">
						<div><input type="radio" name="window" value="001" id="p1" data-pType="1" checked><label for="p1">Red Curtain Windows<br/>赤カーテンの窓</label></div>
						<div><input type="radio" name="window" value="002" id="p2" data-pType="1"><label for="p2">Green Curtain Windows<br/>緑カーテンの窓</label></div>
						<div><input type="radio" name="window" value="003" id="p3" data-pType="1"><label for="p3">Blue Curtain Windows<br/>青カーテンの窓</label></div>
						<div><input type="radio" name="window" value="004" id="p4" data-pType="full"><label for="p4">Guardian Office New Year Decorations<br/>鎮守府新年飾り</label></div>
						<div><input type="radio" name="window" value="005" id="p5" data-pType="full"><label for="p5">Hamaya Windows<br/>破魔矢の窓</label></div>
						<div><input type="radio" name="window" value="006" id="p6" data-pType="1"><label for="p6">Slightly Gorgeous Window<br/>ちょっとゴージャスな窓</label></div>
						<div><input type="radio" name="window" value="007" id="p7" data-pType="full"><label for="p7">Late Autumn High Class Japanese Window<br/>晩秋の高級和窓</label></div>
						<div><input type="radio" name="window" value="008" id="p8" data-pType="1"><label for="p8">Elegant Blue Large Window<br/>青い上品な大窓</label></div>
						<div><input type="radio" name="window" value="009" id="p9" data-pType="full"><label for="p9">Wide Open Large Window<br/>広く開いた大窓</label></div>
						<div><input type="radio" name="window" value="010" id="p10" data-pType="2"><label for="p10">Small White Curtain Window<br/>白いカーテンの小窓</label></div>
						<div><input type="radio" name="window" value="011" id="p11" data-pType="full"><label for="p11">Hinamatsuri Window<br/>桃の節句の窓</label></div>
						<div><input type="radio" name="window" value="012" id="p12" data-pType="3"><label for="p12">Refreshing Window<br/>爽やかな窓</label></div>
						<div><input type="radio" name="window" value="013" id="p13" data-pType="full"><label for="p13">Teru Teru Bozu Window<br/>てるてる坊主の窓</label></div>
						<div><input type="radio" name="window" value="014" id="p14" data-pType="full"><label for="p14">Hydrangea Window<br/>紫陽花の窓</label></div>
						<div><input type="radio" name="window" value="015" id="p15" data-pType="full"><label for="p15">Blossom-Viewing Window<br/>お花見窓</label></div>
						<div><input type="radio" name="window" value="016" id="p16" data-pType="1"><label for="p16">Barred Window<br/>鉄格子の窓</label></div>
						<div><input type="radio" name="window" value="017" id="p17" data-pType="1"><label for="p17">Moon-Viewing Window<br/>お月見窓</label></div>
						<div><input type="radio" name="window" value="018" id="p18" data-pType="3"><label for="p18">Air Defense Manufacturing Window<br/>防空加工窓</label></div>
						<div><input type="radio" name="window" value="019" id="p19" data-pType="1"><label for="p19">Deluxe Sliding Door<br/>障子デラックス</label></div>
						<div><input type="radio" name="window" value="020" id="p20" data-pType="1"><label for="p20">Simple Frame Type 1<br/>シンプルフレーム1型</label></div>
						<div><input type="radio" name="window" value="021" id="p21" data-pType="1"><label for="p21">Simple Frame Type 2<br/>シンプルフレーム2型</label></div>
						<div><input type="radio" name="window" value="022" id="p22" data-pType="full"><label for="p22">Luxurious Moon-Viewing Window<br/>豪華なお月見窓</label></div>
						<div><input type="radio" name="window" value="023" id="p23" data-pType="1"><label for="p23">Simple Blinds Window<br/>シンプルなすだれ窓</label></div>
						<div><input type="radio" name="window" value="024" id="p24" data-pType="3"><label for="p24">Bamboo Blinds Window<br/>すだれ窓</label></div>
						<div><input type="radio" name="window" value="025" id="p25" data-pType="3"><label for="p25">Old-Fashioned Frosted Glass<br/>昔ながらのすりガラス</label></div>
						<div><input type="radio" name="window" value="026" id="p26" data-pType="1"><label for="p26">Winter Window Made by the Kanmusu<br/>艦娘による冬の窓</label></div>
						<div><input type="radio" name="window" value="027" id="p27" data-pType="full"><label for="p27">Winter Stained Glass<br/>冬のステンドグラス</label></div>
						<div><input type="radio" name="window" value="028" id="p28" data-pType="3"><label for="p28">Stylish Lattice Window<br/>おしゃれな格子窓</label></div>
						<div><input type="radio" name="window" value="029" id="p29" data-pType="3"><label for="p29">Sliding Door<br/>障子</label></div>
						<div><input type="radio" name="window" value="030" id="p30" data-pType="full"><label for="p30">High Class Spring Window<br/>春の高級窓</label></div>
						<div><input type="radio" name="window" value="031" id="p31" data-pType="full"><label for="p31">Tanabata Decorations Window<br/>七夕飾りの窓</label></div>
						<div><input type="radio" name="window" value="032" id="p32" data-pType="full"><label for="p32">Mosquito Coil Window<br/>蚊取り線香の窓</label></div>
						<div><input type="radio" name="window" value="033" id="p33" data-pType="full"><label for="p33">Guardian Office Wind Chimes<br/>鎮守府風鈴</label></div>
						<div><input type="radio" name="window" value="034a" id="p34a" data-pType="full"><label for="p34a">Fireworks Window<br/>花火の窓</label></div>
						<div><input type="radio" name="window" value="034b" id="p34b" data-pType="full"><label for="p34b">Fireworks Window "Red"<br/>花火の窓「赤」</label></div>
						<div><input type="radio" name="window" value="034c" id="p34c" data-pType="full"><label for="p34c">Fireworks Window "White"<br/>花火の窓「白」</label></div>
						<div><input type="radio" name="window" value="034d" id="p34d" data-pType="full"><label for="p34d">Fireworks Window "Yellow"<br/>花火の窓「黄」</label></div>
						<div><input type="radio" name="window" value="034e" id="p34e" data-pType="full"><label for="p34e">Fireworks Window "Blue"<br/>花火の窓「青」</label></div>
						<div><input type="radio" name="window" value="035" id="p35" data-pType="full"><label for="p35">Signs of Autumn Window<br/>秋の気配な窓</label></div>
						<div><h4>Guardian Office Bar Counter<br/>鎮守府カウンターバー</h4><span><input type="radio" name="window" value="036a" id="p36a" data-pType="full"><label for="p36a"> "Beer"<br/>「ビール」</label></span>
						<span><input type="radio" name="window" value="036b" id="p36b" data-pType="full"><label for="p36b">"Whiskey"<br/>「ウィスキー」</label></span>
						<span><input type="radio" name="window" value="036c" id="p36c" data-pType="full"><label for="p36c">"Sake"<br/>「酒」</label></span>
						<span><input type="radio" name="window" value="036d" id="p36d" data-pType="full"><label for="p36d">"Wine"<br/>「ワイン」</label></span>
						<span><input type="radio" name="window" value="036e" id="p36e" data-pType="full"><label for="p36e">"Juice"<br/>「ジュース」</label></span>
						<span><input type="radio" name="window" value="036f" id="p36f" data-pType="full"><label for="p36f">"Rations"<br/>「糧食」</label></span>
						<span><input type="radio" name="window" value="036g" id="p36g" data-pType="full"><label for="p36g">"Beer+Saury"<br/>「ビール+秋刀」</label></span>
						<span><input type="radio" name="window" value="036i" id="p36i" data-pType="full"><label for="p36i">"Whiskey+Saury"<br/>「ウィスキー+秋刀」</label></span>
						<span><input type="radio" name="window" value="036h" id="p36h" data-pType="full"><label for="p36h">"Sake+Saury"<br/>「酒+秋刀」</label></span>
						<span><input type="radio" name="window" value="036j" id="p36j" data-pType="full"><label for="p36j">"Wine+Saury"<br/>「ワイン+秋刀」</label></span>
						<span><input type="radio" name="window" value="036s" id="p36s" data-pType="full"><label for="p36s">"Rations+Saury"<br/>「糧食+秋刀」</label></span>
						<span><input type="radio" name="window" value="036k" id="p36k" data-pType="full"><label for="p36k">"Beer+Turkey"<br/>「ビール+七面鳥」</label></span>
						<span><input type="radio" name="window" value="036l" id="p36l" data-pType="full"><label for="p36l">"Whiskey+Hors d'oeuvres"<br/>「ウィスキー+オードブル」</label></span>
						<span><input type="radio" name="window" value="036m" id="p36m" data-pType="full"><label for="p36m">"Sake+Sweets"<br/>「酒+スイーツ」</label></span>
						<span><input type="radio" name="window" value="036n" id="p36n" data-pType="full"><label for="p36n">"Wine+Panettone"<br/>「ワイン+パネットーネ」</label></span>
						<span><input type="radio" name="window" value="036o" id="p36o" data-pType="full"><label for="p36o">"Juice+Cake"<br/>「ジュース+ケーキ」</label></span>
						<span><input type="radio" name="window" value="036p" id="p36p" data-pType="full"><label for="p36p">"Wine+Stollen"<br/>「ワイン+シュトーレン」</label></span>
						<span><input type="radio" name="window" value="036q" id="p36q" data-pType="full"><label for="p36q">"Italian Wine+Pasta"<br/>「イタリアワイン+パスタ」</label></span>
						<span><input type="radio" name="window" value="036r" id="p36r" data-pType="full"><label for="p36r">"Rations+Turkey"<br/>「糧食+牛皿」</label></span>
						<span><input type="radio" name="window" value="036z" id="p36z" data-pType="full"><label for="p36z">"Beer+Beef Bowl"<br/>「ビール+牛丼」</label></span>
						<span><input type="radio" name="window" value="036t" id="p36t" data-pType="full"><label for="p36t">"Whisky+Beef Plate"<br/>「ウィスキー+牛皿」</label></span>
						<span><input type="radio" name="window" value="036u" id="p36u" data-pType="full"><label for="p36u">"Sake+Beef Bowl"<br/>「酒+牛丼」</label></span>
						<span><input type="radio" name="window" value="036v" id="p36v" data-pType="full"><label for="p36v">"Wine+Beef Plate"<br/>「ワイン+牛皿」</label></span>
						<span><input type="radio" name="window" value="036w" id="p36w" data-pType="full"><label for="p36w">"Juice+Hishimochi+Hina Arare"<br/>「ジュース+菱餅+ひなあられ」</label></span>
						<span><input type="radio" name="window" value="036x" id="p36x" data-pType="full"><label for="p36x">"Italian Wine+Beef Plate"<br/>「イタリアワイン+牛皿」</label></span>
						<span><input type="radio" name="window" value="036y" id="p36y" data-pType="full"><label for="p36y">"Rations+Beef Bowl Takeout"<br/>「糧食+お持ち帰り牛丼」</label></span>
						</div>
						<div><input type="radio" name="window" value="037" id="p37" data-pType="full"><label for="p37">Rainy Season Green Curtain Window<br/>梅雨の緑カーテン窓</label></div>
						<div><input type="radio" name="window" value="038" id="p38" data-pType="full"><label for="p38">Chinese Lantern Plant Flower Window<br/>鬼灯の花の窓</label></div>
						<div><input type="radio" name="window" value="039" id="p39" data-pType="full"><label for="p39">Beach Teahouse Window<br/>浜茶屋の窓</label></div>
						<div><input type="radio" name="window" value="040" id="p40" data-pType="full"><label for="p40">Mutsuki's Window<br/>睦月の窓</label></div>
						<div><input type="radio" name="window" value="041" id="p41" data-pType="full"><label for="p41">Uzuki's Window<br/>卯月の窓</label></div>
					</div>
				</div>
				<div class="furnitureClass" id="Outside">
					<h3>Time of Day</h3>
					<div class="shipOptions">
						<div><input type="radio" name="outside" value="day" id="t1" checked><label for="t1">Day</label></div>
						<div><input type="radio" name="outside" value="rise" id="t2"><label for="t2">Sunrise</label></div>
						<div><input type="radio" name="outside" value="set" id="t3"><label for="t3">Sunset</label></div>
						<div><input type="radio" name="outside" value="eve" id="t4"><label for="t4">Evening</label></div>
						<div><input type="radio" name="outside" value="night" id="t5"><label for="t5">Late Night</label></div>
						<div><label for="tint-color">Tint Color:</label><input id="tint-color" value="#ffffff" type="color"/></div>
					</div>
				</div>
				<div style="clear:both;"></div>
				</div>
				<div id="customInputs" name="#customTab">
					<div><label for="shipImg">Custom Kanmusu Image</label> <input type='file' id="shipImg" /> <button type="button" id="shipClear">Clear</button></div>
					<div><label for="customX">Kanmusu X</label> <input type="number" id="customX" min="-800" max="800" value="0"> <label for="customY">Kanmusu Y</label> <input type="number" id="customY" min="-500" max="500" value="0"></div>
					<div><label for="customZ">Kanmusu Zoom</label> <input type="number" id="customZ" min="-50" max="50" value="0">%</div>
					<div><label for="roomY">Room Camera Y</label> <input type="number" id="roomY" min="-173" max="134" value="0"></div>
					<div><label for="hexOpa">Hexagon Opacity</label> <input type="number" id="hexOpa" min="0" max="1" step="0.01" value="0.33"></div>
					<hr/>
					<div><label for="bgImg">Background Image</label> <input type='file' id="bgImg" /> <button type="button" id="bgClear">Clear</button></div>
					<div><label for="bgX">Background X</label> <input type="number" id="bgX" min="-800" max="800" value="0"> <label for="bgY">Background Y</label> <input type="number" id="bgY" min="-500" max="500" value="0"></div>
					<div><label for="bgZ">Background Zoom</label> <input type="number" id="bgZ" min="10" max="500" value="100">%</div>
					<label for="bgStretch">Stretch?</label> <input checked type="checkbox" id="bgStretch"/>
					<div style="margin-top: 10px;">
						<button type="button" id="generate">Update</button>
					</div>
				</div>
			</div>
			<span style="font-family:'Exo';visibility:hidden;">.</span><span style="font-family:'Ubuntu';visibility:hidden;">.</span>
		</div>
		<div id="footer"><p>© 2014-2021 TBES, Sanya.moe, Harvestasya NT all rights belong to their respective owners. Last updated: Jun 1, 2021</p></div>
		<div style="visibility:hidden; overflow-y: hidden; height:0;" id="icondump">
			<img src="bg.jpg" id="bg"></img>
			<img src="furniture/chest/000.png" id="r0"></img>
			<img src="rarity/rarity1.jpg" id="r1"></img>
			<img src="rarity/rarity2.jpg" id="r2"></img>
			<img src="rarity/rarity3.jpg" id="r3"></img>
			<img src="rarity/rarity4.jpg" id="r4"></img>
			<img src="rarity/rarity5.jpg" id="r5"></img>
			<img src="rarity/rarity6.jpg" id="r6"></img>
			<img src="rarity/rarity7.jpg" id="r7"></img>
			<img src="rarity/rarity8.jpg" id="r8"></img>
			<img src="icons/fleet/fleet1.png" id="fleet1"></img>
			<img src="icons/fleet/fleet2.png" id="fleet2"></img>
			<img src="icons/fleet/fleet3.png" id="fleet3"></img>
			<img src="icons/fleet/fleet4.png" id="fleet4"></img>
			<img src="icons/fleet/fleet1a.png" id="fleet1a"></img>
			<img src="icons/fleet/fleet2.png" id="fleet2a"></img>
			<img src="icons/fleet/fleet3.png" id="fleet3a"></img>
			<img src="icons/fleet/fleet4.png" id="fleet4a"></img>
			<img src="furniture/wall/001.png" id="activeWall"></img>
			<img src="furniture/floor/001.png" id="activeFloor"></img>
			<img src="furniture/chest/000.png" id="activeChest"></img>
			<img src="furniture/desk/000.png" id="activeDesk"></img>
			<img src="furniture/object/000.png" id="activeObject"></img>
			<img src="furniture/window/001.png" id="activeWindow"></img>
			<img src="furniture/outside/day1.png" id="activeOutside"></img>
			<img id="avatar"></img>
			<img id="customShip"></img>
		</div>
	</body>
</html>
