+++
draft = false
date = 2021-05-07T23:53:12+09:00
title = "形態素解析器Sudachiについて"
description = "形態素解析器Sudachiについて"
slug = ""
tags = []
categories = []
externalLink = ""
series = []
+++

## Sudachiとは
[Sudachi](https://github.com/WorksApplications/Sudachi)は形態素解析ツールの一つであり、株式会社ワークスアプリケーションズの徳島人工知能NLP研究所が開発している。
[GiNZA](https://megagonlabs.github.io/ginza/)の形態素解析処理にこのSudachiが使われている。

![image](https://user-images.githubusercontent.com/20487308/117477748-56707600-af99-11eb-9080-7a04e99ac78f.png)

## GitHub
- Java
  - https://github.com/WorksApplications/Sudachi
- Python
  - https://github.com/WorksApplications/SudachiPy
- Sudachi辞書
  - https://github.com/WorksApplications/SudachiDict
- Elasticsearchプラグイン
  - https://github.com/WorksApplications/elasticsearch-sudachi

## 形態素解析とは

> 形態素解析（けいたいそかいせき、Morphological Analysis）とは、文法的な情報の注記の無い自然言語のテキストデータ（文）から、対象言語の文法や、辞書と呼ばれる単語の品詞等の情報にもとづき、形態素（Morpheme, おおまかにいえば、言語で意味を持つ最小単位）の列に分割し、それぞれの形態素の品詞等を判別する作業である。 ([Wikipedia](https://ja.wikipedia.org/wiki/%E5%BD%A2%E6%85%8B%E7%B4%A0%E8%A7%A3%E6%9E%90))

あらかじめ用意した辞書などに基づいて文を単語に分割し、それぞれの品詞や原形などを判定する処理のこと。

下のコマンドは[SudachiPy](https://github.com/WorksApplications/SudachiPy)を使った形態素解析の結果。文を単語に分割し、それぞれの品詞や原形などが表示されている。

```bash
$ echo 'にわとりは飛ばない' | sudachipy

にわとり	名詞,普通名詞,一般,*,*,*	鶏
は	助詞,係助詞,*,*,*,*	は
飛ば	動詞,一般,*,*,五段-バ行,未然形-一般	飛ぶ
ない	助動詞,*,*,*,助動詞-ナイ,終止形-一般	ない
EOS
```


## 辞書とは
辞書とは、各単語に対して品詞や活用、分類や読みなどの情報が付与されたデータのこと。
辞書によって単語の分割単位や扱い方が異なる。

以下は代表的な辞書。

- [IPADIC](http://manual.freeshell.org/chasen/ipadic-ja.pdf)
  - MeCabのデフォルト辞書
- [UniDic](https://unidic.ninjal.ac.jp/download#unidic_bccwj)
  - 分割単位が一番短い
- [NEologd](https://github.com/neologd/mecab-ipadic-neologd)
  - MeCab向けの拡張辞書で、新語・固有表現が追加されている
  - 辞書が更新されるたびに[Twitter](https://twitter.com/neologdofficial?lang=ja)で報告されていたが、今は止まってる...？

IPADICの結果

```bash
$ echo '公園に行ったらインスタ映え' | mecab -d /usr/local/lib/mecab/dic/ipadic
公園    名詞,一般,*,*,*,*,公園,コウエン,コーエン
に      助詞,格助詞,一般,*,*,*,に,ニ,ニ
行っ    動詞,自立,*,*,五段・カ行促音便,連用タ接続,行く,イッ,イッ
たら    助動詞,*,*,*,特殊・タ,仮定形,た,タラ,タラ
インスタ        名詞,一般,*,*,*,*,*
映え    名詞,一般,*,*,*,*,映え,ハエ,ハエ
EOS
```

UniDicの結果

```bash
$ echo '公園に行ったらインスタ映え' | mecab -d /usr/local/lib/mecab/dic/unidic
公園    コーエン        コウエン        公園    名詞-普通名詞-一般
に      ニ      ニ      に      助詞-格助詞
行っ    イッ    イク    行く    動詞-非自立可能 五段-カ行       連用形-促音便
たら    タラ    タ      た      助動詞  助動詞-タ       仮定形-一般
イン    イン    イン    イン-in 名詞-普通名詞-一般
スタ    スタ    スタ    スタ    名詞-普通名詞-一般
映え    ハエ    ハエ    映え    名詞-普通名詞-一般
EOS
```

NEologdの結果

```bash
$ echo '公園に行ったらインスタ映え' | mecab -d /usr/local/lib/mecab/dic/mecab-ipadic-neologd
公園    名詞,一般,*,*,*,*,公園,コウエン,コーエン
に      助詞,格助詞,一般,*,*,*,に,ニ,ニ
行っ    動詞,自立,*,*,五段・カ行促音便,連用タ接続,行く,イッ,イッ
たら    助動詞,*,*,*,特殊・タ,仮定形,た,タラ,タラ
インスタ映え    名詞,固有名詞,一般,*,*,*,インスタ映え,インスタハエ,インスタハエ
EOS
```

## 他の日本語形態素解析ツール

- [MeCab](https://taku910.github.io/mecab/)
  - 代表的な形態素解析ツール
  - 処理時間が一番速い
  - CRFで推定している
- [JUMAN](https://nlp.ist.i.kyoto-u.ac.jp/index.php?JUMAN)
  - 人手で整備した辞書+Wikipediaなどから自動収集した辞書に基づいている
- [JUMAN++](https://nlp.ist.i.kyoto-u.ac.jp/?JUMAN%2B%2B)
  - RNN言語モデルを使うことでJUMANよりも高精度になった
- [KyTea](http://www.phontron.com/kytea/index-ja.html)
  - 機械学習によって解析性能を高めた
- [kuromoji](https://www.atilika.com/ja/kuromoji/)
  - Elasticsearchに採用されている
  - Normal, Search, Extendedの3つのモードがある

![image](https://user-images.githubusercontent.com/20487308/117475167-b31e6180-af96-11eb-9ebc-b45209c73103.png)


## Sudachiの特長
### Sudachi辞書
Sudachiのために用意されている辞書 ([SudachiDic](https://github.com/WorksApplications/SudachiDict))。
UniDicとNEologdをもとに専門家が調整した高品質で大規模な資源が用意され、継続して更新されている。
Small、Core、Fullの3つの異なるサイズの辞書がある。

- Small：UniDicの収録語とその正規表現、分割単位を収録
- Core：基本的な語彙を収録 (デフォルト)
- Full：雑多な固有名詞まで収録

### 複数の分割単位の併用
A単位、B単位、C単位の3種類の分割単位で出力が可能。

- A単位：UniDic短単位とほぼ同じ
- B単位：A単位+接辞、および一部の複合動詞
- C単位：複合名詞、固有名詞、慣用句など

複数の分割単位を併用できることで、それぞれの長所を活用することができる。
固有表現抽出したいならC単位、検索したいならA単位を使うなど。
ユーザ辞書を用意して辞書を拡張することも可能。

分割単位の違いの例

```
A：医薬/品/安全/管理/責任/者
B：医薬品/安全/管理/責任者
C：医薬品安全管理責任者

A：消費/者/安全/調査/委員/会
B：消費者/安全/調査/委員会
C：消費者安全調査委員会

A：さっぽろ/テレビ/塔
B：さっぽろ/テレビ塔
C：さっぽろテレビ塔

A：カンヌ/国際/映画/祭
B：カンヌ/国際/映画祭
C：カンヌ国際映画祭
```

## Sudachi辞書にユーザ辞書を登録する方法
Sudachi辞書に登録されていない単語を自分で追加することができる。
こちらを参考にする。

- [Sudachi ユーザー辞書作成方法](https://github.com/WorksApplications/Sudachi/blob/develop/docs/user_dict.md)
- [形態素解析器Sudachiのユーザー辞書には文字正規化が必要](https://zenn.dev/sorami/articles/6bdb4bf6c7f207)

## 参考

- [形態素解析器Sudachiの「辞書」はどのように作られているか: 複数の分割単位を例として](https://zenn.dev/sorami/articles/c9a506000fd1fbd1cf98)
- [Elasticsearchのための新しい形態素解析器 「Sudachi」](https://qiita.com/sorami/items/99604ef105f13d2d472b)
