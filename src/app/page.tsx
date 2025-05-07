import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UNITS } from "@/types";
import { Beaker, BookOpen, Lightbulb, Atom } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヒーローセクション */}
      <section className="flex flex-col items-center text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">
          <span className="text-primary">Lucerna</span> で物理をわかりやすく
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mb-8 text-muted-foreground">
          インタラクティブなシミュレーションで高校物理の概念を視覚的に理解しよう
        </p>
        <div className="flex gap-4 flex-col sm:flex-row">
          <Link href="/mechanics/kinematics/uniform-motion">
            <Button size="lg" className="font-medium">
              シミュレーションを始める
            </Button>
          </Link>
          <Link href="/guide">
            <Button variant="outline" size="lg" className="font-medium">
              使い方ガイド
            </Button>
          </Link>
        </div>
      </section>

      {/* 物理単元セクション */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">物理単元</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {UNITS.map((unit) => (
            <Link key={unit.id} href={`/${unit.id}`}>
              <Card className="p-6 h-full transition-all hover:shadow-md">
                <div className="flex items-center mb-4">
                  {unit.id === 'mechanics' && <Atom className="w-8 h-8 text-primary mr-2" />}
                  {unit.id === 'thermodynamics' && <Beaker className="w-8 h-8 text-primary mr-2" />}
                  {unit.id === 'waves' && <Lightbulb className="w-8 h-8 text-primary mr-2" />}
                  {unit.id === 'electromagnetism' && <Atom className="w-8 h-8 text-primary mr-2" />}
                  <h3 className="text-xl font-bold">{unit.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{unit.description}</p>
                <div className="text-sm">
                  {unit.topics.length}トピック・{unit.topics.reduce((acc, topic) => acc + topic.simulations.length, 0)}シミュレーション
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-12 bg-muted/50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Lucernaの特徴</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <Beaker className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">インタラクティブな学習</h3>
            <p className="text-muted-foreground">
              リアルタイムでパラメータを変更し、物理現象がどのように変化するかを観察できます。
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <BookOpen className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">高校物理に沿ったコンテンツ</h3>
            <p className="text-muted-foreground">
              高校物理の教科書に沿った内容で、基本概念から発展的な内容まで段階的に学べます。
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Lightbulb className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">直感的な理解</h3>
            <p className="text-muted-foreground">
              難解な物理概念を視覚的に表現することで、直感的な理解を促進します。
            </p>
          </div>
        </div>
      </section>

      {/* コールトゥアクション */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">今すぐ物理を学びましょう</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
          Lucernaの物理シミュレーションで学習効率を高めてみませんか？
        </p>
        <Link href="/mechanics/kinematics/uniform-motion">
          <Button size="lg" className="font-medium">
            シミュレーションを始める
          </Button>
        </Link>
      </section>
    </div>
  );
}
