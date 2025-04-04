import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import DatabaseConfig from "./DatabaseConfig";

@Module({
    imports: [ConfigModule.forRoot({
        load: [DatabaseConfig],
        isGlobal: true
    })],
    providers: [ConfigService],
    exports: [ConfigService]
})
export class ConfigsModule {}